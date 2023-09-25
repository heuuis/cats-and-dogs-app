import { alternateMergeArrays } from "../utils/arrays";
import { createDAG } from "./dag";

type Animal = {
  type: "cat" | "dog";
  id: string;
};

export const TournamentResults = (
  initialCats?: Set<string>,
  initialDogs?: Set<string>
) => {
  const dag = createDAG();
  const { addNode, addEdge, getAllNodes, getDirectChildren, doesCauseCycle } =
    dag;

  const prefixId = (type: string, id: string) => `${type} ${id}`;
  const unprefixId = (prefixedId: string) => prefixedId.split(" ")[1];
  const getAnimalType = (prefixedId: string) => prefixedId.split(" ")[0];

  const addCat = (id: string): void => {
    addNode(prefixId("cat", id));
  };

  const addDog = (id: string): void => {
    addNode(prefixId("dog", id));
  };

  const getAllAnimals = () => {
    return getAllNodes().map(unprefixId);
  };

  const addResult = (winner: Animal, loser: Animal): void => {
    if (winner.type === loser.type) {
      console.error("Cannot add edge between same types of animals.");
      return;
    }
    addEdge(prefixId(winner.type, winner.id), prefixId(loser.type, loser.id));
    updateAdjacencyList();
  };

  const updateAdjacencyList = () => {
    const nodes = getAllNodes();
    nodes.forEach((node) => {
      const animalType = node[0];
      [...getAllAnimalsLessCute(node)]
        .filter((x) => x[0] !== animalType)
        .forEach((childNode) => addEdge(node, childNode));
    });
  };

  const getAllAnimalsLessCute = (node: string): Set<string> => {
    const allAnimalsLessCute: Set<string> = new Set();
    const getAnimalsLessCute = (node: string) => {
      getDirectChildren(node).forEach((childNode) => {
        allAnimalsLessCute.add(childNode);
        getAnimalsLessCute(childNode);
      });
    };
    getAnimalsLessCute(node);
    return allAnimalsLessCute;
  };

  const getValidComparisons = (): [string, string][] => {
    const allNodes = getAllNodes();
    const cats = allNodes.filter((node) => getAnimalType(node) === "cat");
    const dogs = allNodes.filter((node) => getAnimalType(node) === "dog");

    const validEdges: [string, string][] = [];

    for (const cat of cats) {
      for (const dog of dogs) {
        if (
          !getDirectChildren(cat).has(dog) &&
          !doesCauseCycle(cat, dog) &&
          !doesCauseCycle(dog, cat)
        ) {
          validEdges.push([unprefixId(cat), unprefixId(dog)]);
        }
      }
    }

    return validEdges;
  };

  const getRankings = (): string[][] => {
    const allNodes = getAllNodes();
    const cats = allNodes.filter((node) => node[0] === "c");
    const dogs = allNodes.filter((node) => node[0] === "d");
    // A directed acyclic graph always has at least one element with no incoming edges since DAG <=> Topologically ordered
    // This means exactly one of cats or dogs has a node which has out-degree the number of the other animal
    const catsWin = cats.some(
      (node) => getDirectChildren(node).size === dogs.length
    );
    const dogsWin = dogs.some(
      (node) => getDirectChildren(node).size === cats.length
    );
    if (catsWin === dogsWin) {
      console.error(
        "Something's gone wrong, either both sides have won or neither side has won..."
      );
      return [];
    }

    const orderGroupsByChildren = (
      animals: string[],
      length: number
    ): string[][] => {
      return animals.reduce(
        (animalGroups: string[][], node: string) => {
          const index = getDirectChildren(node).size;
          animalGroups[index] = animalGroups[index] || [];
          animalGroups[index].push(node);
          return animalGroups;
        },
        Array.from(Array(length), () => [])
      );
    };
    const orderedCatGroups = orderGroupsByChildren(cats, dogs.length + 1);
    const orderedDogGroups = orderGroupsByChildren(dogs, cats.length + 1);

    return catsWin
      ? alternateMergeArrays(orderedCatGroups, orderedDogGroups).map((group) =>
          group.map(unprefixId)
        )
      : alternateMergeArrays(orderedDogGroups, orderedCatGroups).map((group) =>
          group.map(unprefixId)
        );
  };

  if (initialCats) {
    initialCats.forEach(addCat);
  }

  if (initialDogs) {
    initialDogs.forEach(addDog);
  }

  return {
    addCat,
    addDog,
    addResult,
    getValidComparisons,
    getRankings,
    getAllAnimals,
  };
};
