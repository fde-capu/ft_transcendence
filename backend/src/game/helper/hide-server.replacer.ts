export function hideServer<T>(key: any, value: T): T {
  if (key == 'server') return undefined;
  return value;
}
