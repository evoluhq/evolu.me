/**
 * For non-unique id, use React Hook useId.
 * useId can't be global so it must be passed it as a prop.
 */
export const createKeyNavigationUniqueId = <T extends string>(
  names: T[]
): { [K in T]: string } => {
  let counter = 0;
  const createId = () => `uid:${(counter++).toString(36)}`;
  const id: Record<string, string> = {};
  names.forEach((name) => {
    id[name] = createId();
  });
  return id as never;
};
