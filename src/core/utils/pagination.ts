export function getSerialNumber(
  index: number,
  page: number,
  size: number,
): number {
  return (page - 1) * size + index + 1;
}
