export const localStorageKeys = {
  newNodeAtom: "evolume:newNodeAtom",
  editNodeAtom: "evolume:editNodeAtom",
};

// Must be called before Evolu restoreOwner and resetOwner.
export const clearAllLocalStorageKeys = () => {
  Object.values(localStorageKeys).forEach((value) => {
    localStorage.removeItem(value);
  });
};
