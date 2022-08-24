export const isObject = (value) => {
  return typeof value === "object" && value !== null;
};

export const isString = (value) => {
  return typeof value === "string";
};

export const isNumber = (value) => {
  return typeof value === "number";
};

export const isFunction = (value) => {
  return typeof value === "function";
};

export const hasChanged = (val, newVal) => !Object.is(val, newVal); // 比对两个账户是否相同

export const isArray = Array.isArray;
export const assign = Object.assign;
