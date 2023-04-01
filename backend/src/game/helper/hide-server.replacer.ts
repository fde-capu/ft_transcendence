export function hideServer<T>(key: any, value: T): T {
  if (key == 'server') return undefined;
  if (key == 'service') return undefined;
  if (key == 'game') return undefined;
  if (key == 'gameInterval') return undefined;
  if (key == 'lastUpdate') return undefined;
  return value;
}

export function hideCircular(obj: object): object {
  return JSON.parse(JSON.stringify(obj, hideServer));
}
