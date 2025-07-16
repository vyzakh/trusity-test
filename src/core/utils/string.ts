export const emptyStringToNull = (
  value: string | null | undefined,
): string | null => {
  return value === "" ? null : (value ?? null);
};
