type AdjacencyList = {
  [key: string]: Set<string>;
};

export const createDAG = () => {
  let adjList: AdjacencyList = {};

  const addNode = (node: string): void => {
    if (!adjList[node]) {
      adjList[node] = new Set();
    }
  };

  const addEdge = (from: string, to: string): void => {
    // Add nodes if they don't exist
    addNode(from);
    addNode(to);
    // Check if the edge creates a cycle
    if (doesCauseCycle(from, to)) {
      console.error(`Edge from ${from} to ${to} causes a cycle!`);
      return;
    }
    adjList[from].add(to);
  };

  const doesCauseCycle = (from: string, to: string) => {
    // DFS to check for a cycle when adding the edge
    const visited: Set<string> = new Set();

    const dfs = (node: string): boolean => {
      if (node === from) return true; // Cycle detected
      if (visited.has(node)) return false; // Already checked and found no cycle

      visited.add(node);
      for (let neighbor of adjList[node]) {
        if (dfs(neighbor)) return true;
      }
      return false;
    };

    return dfs(to);
  };

  const getAllNodes = (): string[] => {
    return Object.keys(adjList);
  };

  const getDirectChildren = (node: string): Set<string> => {
    return adjList[node] || new Set();
  };

  return {
    addNode,
    addEdge,
    getAllNodes,
    getDirectChildren,
    doesCauseCycle,
  };
};
