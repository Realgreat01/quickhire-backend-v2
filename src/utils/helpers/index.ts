import { convert } from 'html-to-text';

const FILTER_EMPTY_VALUES = <T extends object>(obj: T): T => {
  const filtered: Partial<T> = {};
  Object.keys(obj).forEach((key) => {
    const k = key as keyof T;
    if (obj[k] !== null && obj[k] !== undefined && obj[k] !== '') {
      filtered[k] = obj[k];
    }
  });
  return filtered as T;
};

const HTML_TO_TEXT = (html: string) => {
  return convert(html, { preserveNewlines: false }).replace(/\r?\n|\r/g, ' ');
};

export const HELPER_FUNCTIONS = {
  FILTER_EMPTY_VALUES,
  HTML_TO_TEXT,
};
