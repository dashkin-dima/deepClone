const deepClone = (target) => {
  const hash = new Map();

  const createNodeForClone = (item, parentRef = null, key = null) => ({
    item,
    parentRef,
    key,
  });

  const refClonedTarget = {};

  const stack = [createNodeForClone(target, refClonedTarget, "current")];

  while (stack.length !== 0) {
    const current = stack.pop();

    if (current.item === null) {
      current.parentRef[current.key] = null;
      continue;
    }

    if (hash.has(current.item)) {
      current.parentRef[current.key] = hash.get(current.item);
      continue;
    }

    if (Array.isArray(current.item)) {
      const cloneArray = [];
      hash.set(current.item, cloneArray);

      current.parentRef[current.key] = cloneArray;

      for (let index = 0; index < current.item.length; index++) {
        stack.push(createNodeForClone(current.item[index], cloneArray, index));
      }
      continue;
    }

    if (typeof current.item === "object") {
      const cloneObject = {};
      hash.set(current.item, cloneObject);
      const objectKeys = Object.keys(current.item);

      current.parentRef[current.key] = cloneObject;

      if (objectKeys.length === 0) {
        continue;
      }

      for (let key of Object.keys(current.item)) {
        stack.push(createNodeForClone(current.item[key], cloneObject, key));
      }
      continue;
    }

    current.parentRef[current.key] = current.item;
  }

  return refClonedTarget.current;
};

export default deepClone;

