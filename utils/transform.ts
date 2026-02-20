export function stringify(object: unknown) {
  return JSON.stringify(object, (_, value) =>
    typeof value === "bigint" ? value.toString() + "n" : value
  );
}
