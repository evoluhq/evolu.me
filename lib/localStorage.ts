export const localStorageKeys = {
  newEvoluTitle: "evolume:newEvoluTitle",
  editEvoluTitle: "evolume:editEvoluTitle",
};

// Must be called before Evolu restoreOwner.
export const clearAllLocalStorageKeys = () => {
  Object.values(localStorageKeys).forEach((value) => {
    localStorage.removeItem(value);
  });
};
