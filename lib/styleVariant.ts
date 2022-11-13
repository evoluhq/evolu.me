/** Typed helper for Nativewind. */
export const styleVariant = <V extends string | number>(
  value: V,
  styles: { [key in V]: string }
): string => styles[value];
