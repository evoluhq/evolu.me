export const localStorageKeys = {
  newNodeTitle: "evolume:newNodeTitle",
  editNodeTitle: "evolume:editNodeTitle",
  editNodeId: "evolume:editNodeId",
};

// Must be called before Evolu restoreOwner and resetOwner.
export const clearAllLocalStorageKeys = () => {
  Object.values(localStorageKeys).forEach((value) => {
    localStorage.removeItem(value);
  });
};
