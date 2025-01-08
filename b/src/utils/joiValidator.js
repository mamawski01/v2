export function schemaResult(schemaError) {
  if (schemaError.error) throw new TypeError(schemaError.error.message);
  return true;
}
