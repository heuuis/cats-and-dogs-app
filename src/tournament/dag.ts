import { cloneDeep } from "lodash";

// DAG type
export type DAG = Map<string, Set<string>>;

const createDAG = (nodeIds: string[] = []): DAG => {
  const dag = new Map<string, Set<string>>();
  nodeIds.forEach((id) => dag.set(id, new Set()));
  return dag;
};

const addNode = (dag: DAG, id: string): DAG => {
  if (dag.has(id)) {
    throw new Error(`Node with id "${id}" already exists in DAG`);
  }
  let updatedDag: DAG = new Map(dag);
  updatedDag.set(id, new Set());
  return updatedDag;
};

const validateHasNode = (dag: DAG, id: string): void => {
  if (!dag.has(id)) {
    throw new Error(`Node with id "${id}" not found in DAG`);
  }
};

const validateCanAddEdge = (
  dag: DAG,
  fromNodeId: string,
  toNodeId: string
): void => {
  validateHasNode(dag, fromNodeId);
  validateHasNode(dag, toNodeId);

  if (doesCauseCycle(dag, fromNodeId, toNodeId)) {
    throw new Error(
      `Cannot add edge from "${fromNodeId}" to "${toNodeId}" as it would cause a cycle`
    );
  }
};

const addEdge = (dag: DAG, fromNodeId: string, toNodeId: string): DAG => {
  if (dag.get(fromNodeId)?.has(toNodeId)) {
    // return early if existing edge
    return cloneDeep(dag);
  }

  validateCanAddEdge(dag, fromNodeId, toNodeId);

  let updatedDag = cloneDeep(dag);
  updatedDag.get(fromNodeId)!.add(toNodeId);
  return updatedDag;
};

const doesCauseCycle = (
  dag: DAG,
  fromNodeId: string,
  toNodeId: string
): boolean => {
  // DFS to check for a cycle when adding the edge
  const visited: Set<string> = new Set();

  const dfs = (node: string): boolean => {
    if (node === fromNodeId) return true; // Cycle detected
    if (visited.has(node)) return false; // Already checked and found no cycle

    visited.add(node);
    for (let neighbor of dag.get(node)!) {
      if (dfs(neighbor)) return true;
    }
    return false;
  };

  return dfs(toNodeId);
};

const hasCycle = (dag: DAG): boolean => {
  const visited = new Set<string>();
  const stack = new Set<string>();

  const isCyclic = (node: string): boolean => {
    if (!visited.has(node)) {
      visited.add(node);
      stack.add(node);

      const children = dag.get(node) || new Set<string>();
      for (const child of children) {
        if (!visited.has(child) && isCyclic(child)) {
          return true;
        } else if (stack.has(child)) {
          // If the child is in the stack, it's part of a cycle
          return true;
        }
      }
    }

    stack.delete(node); // Remove the node from the stack when done processing
    return false;
  };

  for (const node of dag.keys()) {
    if (isCyclic(node)) {
      return true;
    }
  }

  return false;
};

const getTopologicalSort = (dag: DAG): string[] => {
  const indegrees: { [key: string]: number } = {};
  const topologicalOrdering: string[] = [];

  for (const [node, neighbors] of dag) {
    indegrees[node] = indegrees[node] || 0;
    for (const neighbor of neighbors) {
      indegrees[neighbor] = (indegrees[neighbor] || 0) + 1;
    }
  }

  const nodesWithNoIncomingEdges = Object.keys(indegrees).filter(
    (node) => indegrees[node] === 0
  );

  while (nodesWithNoIncomingEdges.length > 0) {
    const node = nodesWithNoIncomingEdges.pop()!;
    topologicalOrdering.push(node);

    for (const neighbor of dag.get(node) || []) {
      indegrees[neighbor] -= 1;
      if (indegrees[neighbor] === 0) {
        nodesWithNoIncomingEdges.push(neighbor);
      }
    }
  }

  if (topologicalOrdering.length !== dag.size) {
    throw new Error(
      `Invalid DAG: Cycle detected. ${topologicalOrdering.length} elements in ordering but ${dag.size} nodes in DAG`
    );
  }
  return topologicalOrdering;
};

const getAllNeighbours = (dag: DAG, node: string): Set<string> => {
  let neighbours: Set<string> = new Set();
  const addNeighbours = (node: string, knownNeighbours: Set<string>) => {
    validateHasNode(dag, node);
    for (const neighbor of dag.get(node)!) {
      knownNeighbours.add(neighbor);
      addNeighbours(neighbor, knownNeighbours);
    }
  };

  addNeighbours(node, neighbours);
  return neighbours;
};

const getTransitiveClosure = (dag: DAG): DAG => {
  let updatedDag = cloneDeep(dag);
  const sortedNodes = getTopologicalSort(dag);

  for (const node of sortedNodes) {
    updatedDag.set(node, getAllNeighbours(dag, node));
  }

  return updatedDag;
};

// Result will be a DAG because we only ever take a subgraph of the first argument
const getEdgesDifference = (dag: DAG, removeDag: DAG): DAG => {
  let resultDag = cloneDeep(dag);
  for (const [node, neighbours] of removeDag) {
    for (const neighbour of neighbours) {
      if (resultDag.get(node)?.has(neighbour)) {
        resultDag.get(node)!.delete(neighbour);
      }
    }
  }
  const nodesWithNoNeighbours = [...resultDag.keys()].filter(
    (node) => resultDag.get(node)!.size === 0
  );
  const nodesWithAnIncomingEdge: Set<string> = new Set(
    [...resultDag.values()].flatMap((set) => [...set])
  );
  nodesWithNoNeighbours.forEach((node) => {
    if (!nodesWithAnIncomingEdge.has(node)) {
      resultDag.delete(node);
    }
  });

  return resultDag;
};

const mergeDAGs = (dagA: DAG, dagB: DAG): DAG => {
  let resultDag = cloneDeep(dagA);

  for (const [node, children] of dagB) {
    if (resultDag.has(node)) {
      // If the node already exists in resultDag, merge its children
      const existingChildren = resultDag.get(node)!;
      for (const child of children) {
        existingChildren.add(child);
      }
    } else {
      // If the node doesn't exist in dagA, add it with its children
      resultDag.set(node, children);
    }
  }

  if (hasCycle(resultDag)) {
    throw new Error("Tried to merge DAGs but result is not acyclic");
  }
  return resultDag;
};

export {
  createDAG,
  addNode,
  validateCanAddEdge,
  addEdge,
  doesCauseCycle,
  hasCycle,
  getTopologicalSort,
  getTransitiveClosure,
  getEdgesDifference,
  mergeDAGs,
};

// export type Node = {
//   id: string;
//   children: Set<string>;
// };

// const create = (nodeIds: string[] = []): Node[] => {
//   return nodeIds.map((id) => ({ id, children: new Set() }));
// };

// const addNode = (dag: Node[], id: string): Node[] => {
//   if (dag.some((node) => node.id === id)) {
//     throw new Error(`Node with id "${id}" already exists in DAG`);
//   }
//   return [...dag, { id, children: new Set<string>() }];
// };

// const validateCanAddEdge = (
//   dag: Node[],
//   fromNodeId: string,
//   toNodeId: string
// ): void => {
//   if (
//     !dag.some((n) => n.id === fromNodeId) ||
//     !dag.some((n) => n.id === toNodeId)
//   ) {
//     throw new Error("Node not found.");
//   }

//   if (hasCycle(dag, fromNodeId, toNodeId)) {
//     throw new Error(
//       `Cannot add edge from "${fromNodeId}" to "${toNodeId}" as it would cause a cycle`
//     );
//   }
// };

// const addEdge = (dag: Node[], fromNodeId: string, toNodeId: string): Node[] => {
//   validateCanAddEdge(dag, fromNodeId, toNodeId);

//   return dag.map((node) => {
//     if (node.id === fromNodeId) {
//       const newChildren = new Set(node.children);
//       newChildren.add(toNodeId);
//       return { ...node, children: newChildren };
//     }
//     return node;
//   });
// };

// const hasCycle = (
//   dag: Node[],
//   fromNodeId: string,
//   toNodeId: string,
//   visited = new Set<string>()
// ): boolean => {
//   if (visited.has(fromNodeId)) {
//     return true;
//   }

//   visited.add(fromNodeId);
//   const node = dag.find((n) => n.id === fromNodeId);
//   if (!node) return false;

//   for (const child of node.children) {
//     if (child === toNodeId || hasCycle(dag, child, toNodeId, visited)) {
//       return true;
//     }
//   }

//   visited.delete(fromNodeId);
//   return false;
// };

// export { create, addNode, validateCanAddEdge, addEdge };
