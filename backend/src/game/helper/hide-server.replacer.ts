export function hideServer<T>(key: any, value: T): T {
  if (key == 'server') return undefined;
  if (key == 'service') return undefined;
  return value;
}
