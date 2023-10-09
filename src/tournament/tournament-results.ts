import { cloneDeep } from "lodash";
import {
  DAG,
  addEdge,
  validateCanAddEdge,
  getTransitiveClosure,
  getTopologicalSort,
  getEdgesDifference,
  mergeDAGs,
} from "./dag";
import { ContestantCategory } from "./interfaces";

export class ContestantSet {
  private internalSet: Set<string> = new Set();
  private hashToContestant: Map<string, Contestant> = new Map();

  // Utility function to generate a hash for a contestant
  private hash(contestant: Contestant): string {
    return `${contestant.category} ${contestant.id}`;
  }

  constructor(iterable?: Iterable<Contestant>) {
    if (iterable) {
      for (let contestant of iterable) {
        this.add(contestant);
      }
    }
  }

  add(contestant: Contestant): void {
    const hashKey = this.hash(contestant);
    this.internalSet.add(hashKey);
    this.hashToContestant.set(hashKey, contestant);
  }

  has(contestant: Contestant): boolean {
    return this.internalSet.has(this.hash(contestant));
  }

  delete(contestant: Contestant): boolean {
    const hashKey = this.hash(contestant);
    this.hashToContestant.delete(hashKey);
    return this.internalSet.delete(hashKey);
  }

  clear(): void {
    this.internalSet.clear();
    this.hashToContestant.clear();
  }

  forEach(callback: (contestant: Contestant) => void): void {
    this.internalSet.forEach((hashKey) => {
      const contestant = this.hashToContestant.get(hashKey);
      if (contestant) {
        callback(contestant);
      }
    });
  }

  get size(): number {
    return this.internalSet.size;
  }

  *[Symbol.iterator](): Iterator<Contestant> {
    for (let hashKey of this.internalSet) {
      const contestant = this.hashToContestant.get(hashKey);
      if (contestant) {
        yield contestant;
      }
    }
  }
}

export type Contestant = {
  id: string;
  category: ContestantCategory;
};

export type ContestantResults = {
  contestant: Contestant;
  defeatedOpponents: ContestantSet;
};

export type Fixture = { [category in ContestantCategory]: string };

const hash = (contestant: Contestant): string =>
  `${contestant.category} ${contestant.id}`;

const unhash = (contestant: string): Contestant => {
  const [categoryString, id] = contestant.split(" ");
  const category = categoryString as ContestantCategory;
  return { category, id };
};

const resultsToDag = (results: ContestantResults[]): DAG =>
  results.reduce(
    (acc: DAG, results: ContestantResults) =>
      acc.set(
        hash(results.contestant),
        new Set([...results.defeatedOpponents].map(hash))
      ),
    new Map()
  );

const dagToResults = (dag: DAG): ContestantResults[] =>
  [...dag].map(([node, children]) => ({
    contestant: unhash(node),
    defeatedOpponents: new ContestantSet(
      [...children]
        .map(unhash)
        .filter((opponent) => opponent.category !== unhash(node).category)
    ),
  }));

const create = (
  cats: string[] = [],
  dogs: string[] = []
): ContestantResults[] => {
  const catContestants: Contestant[] = cats.map((id) => ({
    id,
    category: "cat",
  }));
  const dogContestants: Contestant[] = dogs.map((id) => ({
    id,
    category: "dog",
  }));
  return [...catContestants, ...dogContestants].map((contestant) => ({
    contestant,
    defeatedOpponents: new ContestantSet(),
  }));
};

const addContestant = (
  results: ContestantResults[],
  contestant: Contestant
): ContestantResults[] => {
  return [...results, { contestant, defeatedOpponents: new ContestantSet() }];
};

const validateCanAddResult = (
  results: ContestantResults[],
  winner: Contestant,
  loser: Contestant
): void => {
  if (winner.category === loser.category) {
    throw new Error(
      `Cannot add results between contestants in same category (${winner.category})`
    );
  }

  const dag: DAG = resultsToDag(results);

  try {
    validateCanAddEdge(dag, hash(winner), hash(loser));
  } catch (error) {
    throw new Error(
      `Cannot add result with winner category "${winner.category}" id "${winner.id}" and loser category "${loser.category}" id "${loser.id}" as it would cause a cycle`
    );
  }
};

const addResult = (
  results: ContestantResults[],
  winner: Contestant,
  loser: Contestant
): ContestantResults[] => {
  validateCanAddResult(results, winner, loser);

  return dagToResults(
    addEdge(resultsToDag(results), hash(winner), hash(loser))
  );
};

const getValidFixtures = (results: ContestantResults[]): Fixture[] => {
  const allContestants = results.map(({ contestant }) => contestant);

  const cats = allContestants.filter(({ category }) => category === "cat");
  const dogs = allContestants.filter(({ category }) => category === "dog");

  const validFixtures: Fixture[] = [];

  for (const cat of cats) {
    for (const dog of dogs) {
      try {
        validateCanAddResult(results, cat, dog);
        validateCanAddResult(results, dog, cat);
        validFixtures.push({
          cat: cat.id,
          dog: dog.id,
        });
      } catch (error) {
        continue;
      }
    }
  }

  return validFixtures;
};

const getExtendedResults = (
  results: ContestantResults[]
): ContestantResults[] => {
  return dagToResults(getTransitiveClosure(resultsToDag(results)));
};

const getResultsDifference = (
  results: ContestantResults[],
  removeResults: ContestantResults[]
): ContestantResults[] => {
  const difference = dagToResults(
    getEdgesDifference(resultsToDag(results), resultsToDag(removeResults))
  );
  return difference.filter((result) => result.defeatedOpponents.size > 0);
};

const getRankings = (results: ContestantResults[]): Contestant[][] => {
  const sortedResults: Contestant[] = getTopologicalSort(
    resultsToDag(results)
  ).map(unhash);
  let rankings: Contestant[][] = [];
  if (sortedResults.length === 0) {
    return rankings;
  }

  let currentGroup: Contestant[] = [sortedResults[0]];

  for (let i = 1; i < sortedResults.length; i++) {
    const currentContestant = sortedResults[i];
    const previousContestant = sortedResults[i - 1];

    if (currentContestant.category === previousContestant.category) {
      currentGroup.push(currentContestant);
    } else {
      rankings.push(currentGroup);
      currentGroup = [currentContestant];
    }
  }

  rankings.push(currentGroup);

  return rankings;
};

const getContestantResults = (
  results: ContestantResults[],
  contestant: Contestant
) => {
  const { id: searchId, category: searchCategory } = contestant;
  const result = results.find(
    ({ contestant: { id, category } }) =>
      id === searchId && category === searchCategory
  );
  if (!result) {
    throw new Error(
      `Couldn't find results for contestant ${searchId} in category ${searchCategory}`
    );
  }
  return result;
};

const mergeResults = (
  resultsA: ContestantResults[],
  resultsB: ContestantResults[]
): ContestantResults[] => {
  const dagA = resultsToDag(resultsA);
  const dagB = resultsToDag(resultsB);
  try {
    const mergedDag = mergeDAGs(dagA, dagB);
    return dagToResults(mergedDag);
  } catch (error) {
    throw new Error("Cannot merge results as it would cause a cycle");
  }
};

export {
  create,
  addContestant,
  addResult,
  validateCanAddResult,
  getValidFixtures,
  getRankings,
  resultsToDag,
  dagToResults,
  getExtendedResults,
  getResultsDifference,
  getContestantResults,
  mergeResults,
};
