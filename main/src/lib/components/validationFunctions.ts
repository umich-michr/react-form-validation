export type ValueValidator = (
  val: string[] | string | null | undefined,
  ...args: (string | number | boolean | Date)[]
) => boolean;

function isEmptyString(str: string | null | undefined) {
  return !str?.trim().length;
}

function isEmptyArray(arr: Array<string | number | Date>) {
  return !arr?.length;
}

export const isEmpty: ValueValidator = (str, required) => {
  if (!required) {
    return true;
  }
  return Array.isArray(str) ? isEmptyArray(str) : isEmptyString(str);
};

export const isTooLong: ValueValidator = (str, maxLength) => {
  let limit;
  if (typeof maxLength === 'number') {
    limit = maxLength;
  } else if (typeof maxLength === 'string') {
    limit = parseInt(maxLength);
    if (isNaN(limit)) {
      throw new Error(`isTooLong function can not handle non numeric values, value passed ${maxLength}`);
    }
  } else {
    throw new Error(`isTooLong function can not handle non numeric values, value passed ${maxLength}`);
  }
  return !!str && str?.length > limit;
};

export const isEmail: ValueValidator = (str) => {
  if (Array.isArray(str)) {
    throw new Error('Should not pass an array to check if the input is email.');
  }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !!str && re.test(str);
};
