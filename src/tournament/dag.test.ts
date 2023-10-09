import {
  DAG,
  createDAG,
  addNode,
  addEdge,
  doesCauseCycle,
  getTopologicalSort,
  getTransitiveClosure,
  getEdgesDifference,
  mergeDAGs,
  hasCycle,
} from "./dag";
import { cloneDeep } from "lodash";

describe("Directed Acyclic Graph", () => {
  let initialDag: DAG;

  beforeEach(() => {
    initialDag = createDAG();
  });

  it("creates empty", () => {
    expect(initialDag.size).toBe(0);
  });

  it("creates with given nodes", () => {
    const nodeIds = ["A", "B", "C"];
    let expectedDag: DAG = new Map<string, Set<string>>();
    expectedDag.set("A", new Set<string>());
    expectedDag.set("B", new Set<string>());
    expectedDag.set("C", new Set<string>());

    const dag = createDAG(nodeIds);

    expect(dag).toEqual(expectedDag);
  });

  it("adds nodes as keys in map", () => {
    let expectedDag: DAG = new Map<string, Set<string>>();
    expectedDag.set("A", new Set<string>());

    const dag = addNode(initialDag, "A");

    expect(dag).toEqual(expectedDag);
  });

  it("adds edges as values in map", () => {
    let expectedDag: DAG = new Map<string, Set<string>>();
    expectedDag.set("A", new Set<string>(["B"]));
    expectedDag.set("B", new Set<string>());
    let dag = createDAG(["A", "B"]);

    dag = addEdge(dag, "A", "B");

    expect(dag).toEqual(expectedDag);
  });

  it("can add new node", () => {
    const dag = addNode(initialDag, "test");

    expect(dag.size).toEqual(1 + initialDag.size);
    expect(dag.get("test")).toEqual(new Set());
  });

  it("cannot add existing node", () => {
    const tryAddSameNode = () => {
      const dag = createDAG(["test"]);
      addNode(dag, "test");
    };

    expect(tryAddSameNode).toThrow(`Node with id "test" already exists in DAG`);
  });

  it("can add existing edge", () => {
    let dag = createDAG(["A", "B"]);

    dag = addEdge(dag, "A", "B");
    dag = addEdge(dag, "A", "B");

    expect(dag.get("A")).toEqual(new Set(["B"]));
    expect(dag.get("B")).toEqual(new Set());
  });

  it("recognises does not cause cycle", () => {
    let dag = createDAG(["A", "B", "C"]);
    dag = addEdge(dag, "A", "B");
    dag = addEdge(dag, "B", "C");

    expect(doesCauseCycle(dag, "A", "C")).toBeFalsy();
  });

  it("can add valid edge", () => {
    let dag = createDAG(["A", "B", "C"]);
    dag = addEdge(dag, "A", "B");
    dag = addEdge(dag, "B", "C");

    dag = addEdge(dag, "A", "C");

    expect(dag.get("A")).toEqual(new Set(["B", "C"]));
    expect(dag.get("B")).toEqual(new Set(["C"]));
    expect(dag.get("C")).toEqual(new Set());
  });

  it("recognises does cause cycle", () => {
    let dag = createDAG(["A", "B", "C"]);
    dag = addEdge(dag, "A", "B");
    dag = addEdge(dag, "B", "C");

    expect(doesCauseCycle(dag, "C", "A")).toBeTruthy();
  });

  it("cannot add edge to self", () => {
    const tryAddEdgeToSelf = () => {
      const dag = createDAG(["A"]);

      addEdge(dag, "A", "A");
    };
    expect(tryAddEdgeToSelf).toThrow(
      `Cannot add edge from "A" to "A" as it would cause a cycle`
    );
  });

  it("cannot add edge to non-existant node", () => {
    const tryAddEdgeToNonExistant = () => {
      const dag = createDAG(["A"]);

      addEdge(dag, "A", "B");
    };
    expect(tryAddEdgeToNonExistant).toThrow(
      `Node with id "B" not found in DAG`
    );
  });

  it("cannot add backward edge", () => {
    const tryAddInvalidEdge = () => {
      let dag = createDAG(["A", "B"]);
      dag = addEdge(dag, "A", "B");

      dag = addEdge(dag, "B", "A");
    };
    expect(tryAddInvalidEdge).toThrow(
      `Cannot add edge from "B" to "A" as it would cause a cycle`
    );
  });

  it("cannot add edge which cause cycle", () => {
    const tryAddCycleEdge = () => {
      let dag = createDAG(["A", "B", "C"]);
      dag = addEdge(dag, "A", "B");
      dag = addEdge(dag, "B", "C");

      dag = addEdge(dag, "C", "A");
    };

    expect(tryAddCycleEdge).toThrow(
      `Cannot add edge from "C" to "A" as it would cause a cycle`
    );
  });

  it("add node does not mutate passed argument", () => {
    const expectedDag: DAG = cloneDeep(initialDag);

    addNode(initialDag, "A");

    expect(initialDag).toEqual(expectedDag);
  });

  it("add edge does not mutate passed argument", () => {
    let initialDag: DAG = createDAG(["A", "B"]);
    const expectedDag: DAG = cloneDeep(initialDag);

    addEdge(initialDag, "A", "B");

    expect(initialDag).toEqual(expectedDag);
    expect(initialDag.get("A")).toEqual(new Set());
  });

  it("can get topological sort of disjoint dag", () => {
    const expectedSorts = [
      ["A", "B"],
      ["B", "A"],
    ];
    let dag = createDAG(["A", "B"]);

    const result = getTopologicalSort(dag);
    expect(expectedSorts).toContainEqual(result);
  });

  it("can get topological sort of linear dag", () => {
    const expectedSort = ["A", "B", "C", "D"];
    let dag = createDAG(["A", "B", "C", "D"]);
    dag = addEdge(dag, "A", "B");
    dag = addEdge(dag, "B", "C");
    dag = addEdge(dag, "C", "D");

    const result = getTopologicalSort(dag);
    expect(result).toEqual(expectedSort);
  });

  it("can get topological sort of non-linear dag", () => {
    // NOTE: there are multiple topological sorts for this dag,
    // our algorithm produces one of them but depending on the
    // details we could have:
    const expectedSorts = [
      ["A", "B", "C", "D"],
      ["B", "A", "C", "D"],
      ["B", "C", "A", "D"],
    ];
    let dag = createDAG(["A", "B", "C", "D"]);
    dag = addEdge(dag, "A", "D");
    dag = addEdge(dag, "B", "C");
    dag = addEdge(dag, "C", "D");

    const result = getTopologicalSort(dag);
    expect(expectedSorts).toContainEqual(result);
  });

  it("cannot get topological sort of invalid dag", () => {
    let invalidDag: DAG = new Map<string, Set<string>>();
    invalidDag.set("A", new Set<string>(["B"]));
    invalidDag.set("B", new Set<string>(["C"]));
    invalidDag.set("C", new Set<string>(["A"]));

    expect(() => getTopologicalSort(invalidDag)).toThrow(
      "Invalid DAG: Cycle detected."
    );
  });

  it("can get correct transitive closure of partitioned dag", () => {
    let initialDag = createDAG(["A", "B", "C", "D"]);
    initialDag = addEdge(initialDag, "A", "B");
    initialDag = addEdge(initialDag, "B", "C");

    const expectedDag = addEdge(initialDag, "A", "C");
    const dag = getTransitiveClosure(initialDag);

    // Deep equality checking, using expect.toEqual can fail due to ordering of sets
    dag.forEach((value, key) => {
      expect(value).toEqual(expectedDag.get(key));
    });
    expectedDag.forEach((value, key) => {
      expect(value).toEqual(dag.get(key));
    });
  });

  it("can get correct transitive closure of strongly connected dag", () => {
    let initialDag = createDAG(["A", "B", "C", "D", "E", "F"]);
    initialDag = addEdge(initialDag, "A", "D");
    initialDag = addEdge(initialDag, "A", "E");
    initialDag = addEdge(initialDag, "D", "B");
    initialDag = addEdge(initialDag, "B", "F");
    initialDag = addEdge(initialDag, "F", "C");

    let expectedDag = addEdge(initialDag, "A", "B");
    expectedDag = addEdge(expectedDag, "A", "C");
    expectedDag = addEdge(expectedDag, "A", "F");
    expectedDag = addEdge(expectedDag, "B", "C");
    expectedDag = addEdge(expectedDag, "D", "C");
    expectedDag = addEdge(expectedDag, "D", "F");

    const dag = getTransitiveClosure(initialDag);

    // Deep equality checking, using expect.toEqual can fail due to ordering of sets
    dag.forEach((value, key) => {
      expect(value).toEqual(expectedDag.get(key));
    });
    expectedDag.forEach((value, key) => {
      expect(value).toEqual(dag.get(key));
    });
  });

  it("can get difference between DAGs as edges in first dag not in second dag", () => {
    let initialDag = createDAG(["A", "B", "C"]);
    initialDag = addEdge(initialDag, "A", "B");

    let dag = addNode(initialDag, "D");
    dag = addNode(dag, "E");
    dag = addEdge(dag, "B", "C");
    dag = addEdge(dag, "C", "D");

    // We really only want the edges so we shouldn't get the extra node "E"
    let expectedDag = createDAG(["B", "C", "D"]);
    expectedDag = addEdge(expectedDag, "B", "C");
    expectedDag = addEdge(expectedDag, "C", "D");

    const resultDag = getEdgesDifference(dag, initialDag);

    expect(resultDag).toEqual(expectedDag);
  });

  it("can find no cycle in valid dag object", () => {
    const dag: DAG = new Map([
      ["A", new Set(["B", "C"])],
      ["B", new Set(["D"])],
      ["C", new Set(["E"])],
      ["D", new Set()],
      ["E", new Set()],
    ]);

    expect(hasCycle(dag)).toBe(false);
  });

  it("can find cycle in invalid dag object", () => {
    const dagWithCycle: DAG = new Map([
      ["A", new Set(["B"])],
      ["B", new Set(["C"])],
      ["C", new Set(["A"])],
    ]);

    expect(hasCycle(dagWithCycle)).toBe(true);
  });

  it("can merge DAGs if result is a DAG", () => {
    let initialDag = createDAG(["A", "B", "C"]);
    initialDag = addEdge(initialDag, "A", "B");

    const dagA = addEdge(initialDag, "A", "C");
    const dagB = addEdge(initialDag, "B", "C");

    let expectedDag = addEdge(initialDag, "A", "C");
    expectedDag = addEdge(expectedDag, "B", "C");

    const resultDag = mergeDAGs(dagA, dagB);

    expect(resultDag).toEqual(expectedDag);
  });

  it("cannot merge DAGs if result is not acyclic", () => {
    let initialDag = createDAG(["A", "B", "C"]);
    initialDag = addEdge(initialDag, "A", "B");

    const dagA = addEdge(initialDag, "C", "A");
    const dagB = addEdge(initialDag, "B", "C");

    const tryAddDAGsWithCyclicResult = () => {
      mergeDAGs(dagA, dagB);
    };

    expect(tryAddDAGsWithCyclicResult).toThrow(
      "Tried to merge DAGs but result is not acyclic"
    );
  });
});
