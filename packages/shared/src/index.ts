export * from "./patchFlags";
export * from "./slotFlags";

export const EMPTY_OBJ: { readonly [key: string]: any } = {};
export const NOOP = () => {};

export const isObject = (value) => {
  return typeof value === "object" && value !== null;
};

export const NO = () => false;

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

export const enum ShapeFlags {
  ELEMENT = 1, // HTML 或 SVG 标签 普通 DOM 元素
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件
  STATEFUL_COMPONENT = 1 << 2, // 普通有状态组件
  TEXT_CHILDREN = 1 << 3, // 子节点为纯文本
  ARRAY_CHILDREN = 1 << 4, // 子节点是数组
  SLOTS_CHILDREN = 1 << 5, // 子节点是插槽
  TELEPORT = 1 << 6, // Teleport
  SUSPENSE = 1 << 7, // Supspense
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 需要被keep-live的有状态组件
  COMPONENT_KEPT_ALIVE = 1 << 9, //已经被keep-live的有状态组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT, // 有状态组件和函数组件都是组件，用component表示
}
