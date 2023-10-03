/**
 * Merges two arrays of arrays in an alternating fashion, starting with the last element of the first array.
 * Assumes nonempty arr1 with arr1 having a nonempty final element and arr1 having at most one more nonempty element than arr2.
 * @param arr1 - First array of arrays
 * @param arr2 - Second array of arrays
 * @returns - Merged array of arrays
 */
export const alternateMergeArrays = (arr1: any[][], arr2: any[][]): any[][] => {
  let result: any[][] = [arr1.pop()!];

  while (arr2.length) {
    let subArr2: any[] = [];
    while (arr2.length) {
      let temp = arr2.pop()!;
      if (temp.length) {
        subArr2 = temp;
        break;
      }
    }
    if (subArr2.length) {
      result.push(subArr2);
    }
    if (!arr1.length) {
      break;
    }
    let subArr1: any[] = [];
    while (arr1.length) {
      let temp = arr1.pop()!;
      if (temp.length) {
        subArr1 = temp;
        break;
      }
    }
    if (subArr1.length) {
      result.push(subArr1);
    }
  }
  return result.reverse();
};

export const getRandomElement = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)];
