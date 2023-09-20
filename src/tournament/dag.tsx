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
    updateAdjacencyList();
  };

  const doesCauseCycle = (from: string, to: string) => {
    // console.log(`Checking if edge from ${from} to ${to} causes cycle`);
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

  const getAllAnimalsLessCute = (node: string) => {
    const allAnimalsLessCute: Set<string> = new Set();
    const getAnimalsLessCute = (node: string) => {
      adjList[node].forEach((childNode) => {
        allAnimalsLessCute.add(childNode);
        getAnimalsLessCute(childNode);
      });
    };
    getAnimalsLessCute(node);
    return allAnimalsLessCute;
  };

  const updateAdjacencyList = () => {
    const nodes = getAllNodes();
    nodes.forEach((node) => {
      const animalType = node[0];
      const adjacentAnimalType = animalType === "c" ? "d" : "c";
      [...getAllAnimalsLessCute(node)]
        .filter((x) => x[0] === adjacentAnimalType)
        .forEach((childNode) => adjList[node].add(childNode));
    });
  };

  const getAllNodes = (): string[] => {
    return Object.keys(adjList);
  };

  const getValidComparisons = (): [string, string][] => {
    const allNodes = getAllNodes();
    const cats = allNodes.filter((node) => node[0] === "c");
    const dogs = allNodes.filter((node) => node[0] === "d");

    const validEdges: [string, string][] = [];

    for (const cat of cats) {
      for (const dog of dogs) {
        if (
          !adjList[cat].has(dog) &&
          !doesCauseCycle(cat, dog) &&
          !doesCauseCycle(dog, cat)
        ) {
          validEdges.push([cat, dog]);
        }
      }
    }

    return validEdges;
  };

  const getRankings = (): string[][] => {
    const allNodes = getAllNodes();
    const cats = allNodes.filter((node) => node[0] === "c");
    const dogs = allNodes.filter((node) => node[0] === "d");
    const catsWin = cats.some((node) => adjList[node].size === dogs.length);
    const dogsWin = dogs.some((node) => adjList[node].size === cats.length);
    if (catsWin === dogsWin) {
      console.error(
        "Something's gone wrong, either both sides have won or neither side has won..."
      );
      return [];
    }

    const orderedCatGroups: string[][] = Array.from(
      { length: dogs.length + 1 },
      () => []
    );
    cats.forEach((node) => {
      const index = adjList[node].size;
      orderedCatGroups[index].push(node);
    });
    // In fact this orderedCatGroups now has at index n all cats which are cuter than n dogs
    const orderedDogGroups: string[][] = Array.from(
      { length: cats.length + 1 },
      () => []
    );
    dogs.forEach((node) => {
      const index = adjList[node].size;
      orderedDogGroups[index].push(node);
    });

    const mergeArrays = (arr1: string[][], arr2: string[][]): string[][] => {
      // Assume nonempty arr1 with arr1 having a nonempty final element
      let result: string[][] = [arr1.pop()!];
      // Further assume arr1 has at most one more nonempty element than arr2
      while (arr2.length) {
        // Get and remove the last non-empty element from arr2
        let subArr2: string[] = [];
        while (arr2.length) {
          let temp = arr2.pop()!;
          if (temp.length) {
            subArr2 = temp;
            break;
          }
        }
        // Add to result if it's not empty
        if (subArr2.length) {
          result.push(subArr2);
        }
        if (!arr1.length) {
          break;
        }
        let subArr1: string[] = [];
        while (arr1.length) {
          let temp = arr1.pop()!;
          if (temp.length) {
            subArr1 = temp;
            break;
          }
        }
        // Add to result if it's not empty
        if (subArr1.length) {
          result.push(subArr1);
        }
      }
      return result.reverse();
    };

    return catsWin
      ? mergeArrays(orderedCatGroups, orderedDogGroups)
      : mergeArrays(orderedDogGroups, orderedCatGroups);
  };

  return {
    addNode,
    addEdge,
    getAllNodes,
    getValidComparisons,
    getRankings,
  };
};
