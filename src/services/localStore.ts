export function storeObject(key: string, obj: object): boolean {
  const stringifiedObject = JSON.stringify(obj);
  try {
    localStorage.setItem(key, stringifiedObject);
  } catch (e) {
    return false;
  }
  return true;
}

export function retrieveObject(key: string): object | null {
  const stringVal = localStorage.getItem(key);
  if (stringVal) {
    return JSON.parse(stringVal);
  }
  return null;
}
