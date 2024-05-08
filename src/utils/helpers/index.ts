export const FILTER_EMPTY_VALUES = <T extends object>(obj: T): T => {
  const filtered: Partial<T> = {};
  Object.keys(obj).forEach((key) => {
    const k = key as keyof T;
    if (obj[k] !== null && obj[k] !== undefined && obj[k] !== '') {
      filtered[k] = obj[k];
    }
  });
  return filtered as T;
};
