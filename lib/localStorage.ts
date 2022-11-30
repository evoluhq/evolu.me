export const localStorageKeys = {
  newNodeTitle: "evolume:newNodeTitle",
};

// Must be called before Evolu restoreOwner and resetOwner.
export const clearAllLocalStorageKeys = () => {
  Object.values(localStorageKeys).forEach((value) => {
    localStorage.removeItem(value);
  });
};
