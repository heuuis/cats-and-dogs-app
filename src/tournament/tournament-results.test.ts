import { DAG, addEdge, createDAG } from "./dag";
import {
  Contestant,
  ContestantResults,
  ContestantSet,
  addContestant,
  create,
  addResult,
  validateCanAddResult,
  Fixture,
  getValidFixtures,
  dagToResults,
  resultsToDag,
  getExtendedResults,
  getRankings,
  getResultsDifference,
} from "./tournament-results";
import { cloneDeep } from "lodash";

describe("Tournament Results", () => {
  const catId = "c1";
  const dogId = "d1";
  const extraCatId = "c2";
  const extraDogId = "d2";
  const catContestant: Contestant = { id: catId, category: "cat" };
  const dogContestant: Contestant = { id: dogId, category: "dog" };
  const extraCatContestant: Contestant = { id: extraCatId, category: "cat" };
  const extraDogContestant: Contestant = { id: extraDogId, category: "dog" };

  let initialResults: ContestantResults[];

  beforeEach(() => {
    initialResults = create();
  });

  it("creates empty", () => {
    expect(initialResults.length).toBe(0);
  });

  it("creates with given nodes", () => {
    let expectedResults: ContestantResults[] = [
      {
        contestant: catContestant,
        defeatedOpponents: new ContestantSet(),
      },
      {
        contestant: dogContestant,
        defeatedOpponents: new ContestantSet(),
      },
    ];

    const results = create([catId], [dogId]);

    expect(results).toEqual(expectedResults);
  });

  it("can add contestant", () => {
    let expectedResults: ContestantResults[] = [
      {
        contestant: catContestant,
        defeatedOpponents: new ContestantSet(),
      },
      {
        contestant: dogContestant,
        defeatedOpponents: new ContestantSet(),
      },
    ];

    let results = addContestant(initialResults, catContestant);
    results = addContestant(results, dogContestant);

    expect(results).toEqual(expectedResults);
  });

  it("add contestant does not mutate passed argument", () => {
    const expectedResults: ContestantResults[] = cloneDeep(initialResults);

    addContestant(initialResults, { id: "test", category: "cat" });

    expect(initialResults).toEqual(expectedResults);
  });

  it("validates can add existing result", () => {
    const initialResults: ContestantResults[] = [
      {
        contestant: catContestant,
        defeatedOpponents: new ContestantSet([dogContestant]),
      },
      {
        contestant: dogContestant,
        defeatedOpponents: new ContestantSet(),
      },
    ];

    expect(() =>
      validateCanAddResult(initialResults, catContestant, dogContestant)
    ).not.toThrow();
  });

  it("validates can add valid result", () => {
    const initialResults: ContestantResults[] = [
      {
        contestant: catContestant,
        defeatedOpponents: new ContestantSet([dogContestant]),
      },
      {
        contestant: dogContestant,
        defeatedOpponents: new ContestantSet([extraCatContestant]),
      },
      {
        contestant: extraCatContestant,
        defeatedOpponents: new ContestantSet(),
      },
      {
        contestant: extraDogContestant,
        defeatedOpponents: new ContestantSet(),
      },
    ];

    expect(() =>
      validateCanAddResult(initialResults, catContestant, extraDogContestant)
    ).not.toThrow();
    expect(() =>
      validateCanAddResult(
        initialResults,
        extraCatContestant,
        extraDogContestant
      )
    ).not.toThrow();
    expect(() =>
      validateCanAddResult(
        initialResults,
        extraDogContestant,
        extraCatContestant
      )
    ).not.toThrow();
  });

  it("validates cannot add result between same category", () => {
    const initialResults: ContestantResults[] = [
      {
        contestant: catContestant,
        defeatedOpponents: new ContestantSet(),
      },
      {
        contestant: dogContestant,
        defeatedOpponents: new ContestantSet(),
      },
      {
        contestant: extraCatContestant,
        defeatedOpponents: new ContestantSet(),
      },
      {
        contestant: extraDogContestant,
        defeatedOpponents: new ContestantSet(),
      },
    ];

    expect(() =>
      validateCanAddResult(initialResults, catContestant, extraCatContestant)
    ).toThrow("Cannot add results between contestants in same category (cat)");
    expect(() =>
      validateCanAddResult(initialResults, dogContestant, extraDogContestant)
    ).toThrow("Cannot add results between contestants in same category (dog)");
  });

  it("validates cannot add result which makes win order non-transitive", () => {
    const initialResults: ContestantResults[] = [
      {
        contestant: catContestant,
        defeatedOpponents: new ContestantSet([dogContestant]),
      },
      {
        contestant: dogContestant,
        defeatedOpponents: new ContestantSet([extraCatContestant]),
      },
      {
        contestant: extraCatContestant,
        defeatedOpponents: new ContestantSet([extraDogContestant]),
      },
      {
        contestant: extraDogContestant,
        defeatedOpponents: new ContestantSet(),
      },
    ];

    expect(() =>
      validateCanAddResult(
        initialResults,
        extraDogContestant,
        extraCatContestant
      )
    ).toThrow(
      `Cannot add result with winner category "dog" id "d2" and loser category "cat" id "c2" as it would cause a cycle`
    );
    expect(() =>
      validateCanAddResult(initialResults, extraDogContestant, catContestant)
    ).toThrow(
      `Cannot add result with winner category "dog" id "d2" and loser category "cat" id "c1" as it would cause a cycle`
    );
  });

  it("add result does not mutate passed argument", () => {
    let initialResults: ContestantResults[] = create(["test"], ["test"]);
    const expectedResults: ContestantResults[] = cloneDeep(initialResults);

    addResult(
      initialResults,
      { id: "test", category: "dog" },
      { id: "test", category: "cat" }
    );

    expect(initialResults).toEqual(expectedResults);
    expect(
      initialResults.find((item) => item.contestant.category === "dog")!
        .defeatedOpponents
    ).toEqual(new ContestantSet());
  });

  it("can add result", () => {
    let expectedResults: ContestantResults[] = [
      {
        contestant: catContestant,
        defeatedOpponents: new ContestantSet([dogContestant]),
      },
      {
        contestant: dogContestant,
        defeatedOpponents: new ContestantSet(),
      },
    ];

    let results = create([catId], [dogId]);
    results = addResult(results, catContestant, dogContestant);

    expect(results).toEqual(expectedResults);
  });

  it("can get valid fixtures for empty results", () => {
    const expectedFixtures: Fixture[] = [
      {
        cat: catId,
        dog: dogId,
      },
    ];
    const results = create([catId], [dogId]);

    expect(getValidFixtures(results)).toEqual(expectedFixtures);
  });

  it("can get fixtures for partial results with valid comparisons left", () => {
    let results = create([catId, extraCatId], [dogId, extraDogId]);
    results = addResult(results, catContestant, dogContestant);
    results = addResult(results, catContestant, extraDogContestant);
    results = addResult(results, extraCatContestant, extraDogContestant);
    const expectedFixtures: Fixture[] = [
      {
        cat: extraCatId,
        dog: dogId,
      },
    ];

    expect(getValidFixtures(results)).toEqual(expectedFixtures);
  });

  it("can get fixtures for partial results with no valid comparisons left", () => {
    let results = create([catId, extraCatId], [dogId, extraDogId]);
    results = addResult(results, dogContestant, catContestant);
    results = addResult(results, catContestant, extraDogContestant);
    results = addResult(results, extraDogContestant, extraCatContestant);
    const expectedFixtures: Fixture[] = [];

    expect(getValidFixtures(results)).toEqual(expectedFixtures);
  });

  it("can convert back and forth between dag and results", () => {
    const catNode = "cat " + catId;
    const extraCatNode = "cat " + extraCatId;
    const dogNode = "dog " + dogId;
    const extraDogNode = "dog " + extraDogId;

    let dag: DAG = createDAG([catNode, extraCatNode, dogNode, extraDogNode]);
    let results: ContestantResults[] = create(
      [catId, extraCatId],
      [dogId, extraDogId]
    );

    dag = addEdge(dag, catNode, dogNode);
    dag = addEdge(dag, catNode, extraDogNode);
    dag = addEdge(dag, extraCatNode, extraDogNode);

    results = addResult(results, catContestant, dogContestant);
    results = addResult(results, catContestant, extraDogContestant);
    results = addResult(results, extraCatContestant, extraDogContestant);

    expect(resultsToDag(dagToResults(dag))).toEqual(dag);
    expect(dagToResults(resultsToDag(results))).toEqual(results);
  });

  it("can get extended results", () => {
    let results = create([catId, extraCatId], [dogId, extraDogId]);
    results = addResult(results, dogContestant, catContestant);
    results = addResult(results, catContestant, extraDogContestant);
    results = addResult(results, extraDogContestant, extraCatContestant);
    let expectedResults = addResult(results, dogContestant, extraCatContestant);

    expect(getExtendedResults(results)).toEqual(expectedResults);
  });

  it("can get rankings of complete results set", () => {
    let results = create(["A", "B", "C"], ["D", "E", "F"]);
    results = addResult(
      results,
      { category: "cat", id: "A" },
      { category: "dog", id: "D" }
    );
    results = addResult(
      results,
      { category: "cat", id: "A" },
      { category: "dog", id: "E" }
    );
    results = addResult(
      results,
      { category: "dog", id: "D" },
      { category: "cat", id: "B" }
    );
    results = addResult(
      results,
      { category: "cat", id: "B" },
      { category: "dog", id: "F" }
    );
    results = addResult(
      results,
      { category: "dog", id: "F" },
      { category: "cat", id: "C" }
    );
    results = addResult(
      results,
      { category: "dog", id: "E" },
      { category: "cat", id: "C" }
    );
    results = addResult(
      results,
      { category: "cat", id: "B" },
      { category: "dog", id: "E" }
    );

    const expectedRankings = [
      [{ category: "cat", id: "A" }],
      [{ category: "dog", id: "D" }],
      [{ category: "cat", id: "B" }],
      [
        { category: "dog", id: "E" },
        { category: "dog", id: "F" },
      ],
      [{ category: "cat", id: "C" }],
    ];

    expect(getRankings(results)).toEqual(expectedRankings);
  });

  it("can get results difference", () => {
    let initialResults = create([catId, extraCatId], [dogId, extraDogId]);
    initialResults = addResult(initialResults, catContestant, dogContestant);
    initialResults = addResult(
      initialResults,
      dogContestant,
      extraCatContestant
    );
    initialResults = addResult(
      initialResults,
      extraCatContestant,
      extraDogContestant
    );

    let results = addResult(initialResults, catContestant, extraDogContestant);

    const expectedResults: ContestantResults[] = [
      {
        contestant: catContestant,
        defeatedOpponents: new ContestantSet([extraDogContestant]),
      },
    ];

    expect(getResultsDifference(results, initialResults)).toEqual(
      expectedResults
    );
  });
});
