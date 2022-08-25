import {
  isArray,
  isFunction,
  isObject,
  isString,
  PatchFlags,
  ShapeFlags,
  SlotFlags,
} from "@vue/shared";
import { isRef } from "packages/reactivity/src/ref";
import {
  currentRenderingInstance,
  currentScopeId,
} from "./componentRenderContext";
import { isSuspense, isTeleport } from "./components/Suspense";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");
export const Static = Symbol(undefined);

export function isVnode(value) {
  return !!(value && value.__v_isVnode);
}

// 虚拟节点很多：组件，元素。文本
export function createVNode(
  type,
  props,
  children = null,
  patchFlag: number = 0,
  dynamicProps: string[] | null = null,
  isBlockNode = false
) {
  //虚拟DOM就是一个对象，方便diff算法，真实DOM自身属性比较多

  if (props) {
    // ...
  }

  // 获取vnode类型
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isSuspense(type)
    ? ShapeFlags.SUSPENSE
    : isTeleport(type)
    ? ShapeFlags.TELEPORT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0;

  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}

const normalizeKey = ({ key }) => (key != null ? key : null);

const normalizeRef = ({ ref, ref_key, ref_for }) => {
  return (
    ref != null
      ? isString(ref) || isRef(ref) || isFunction(ref)
        ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for }
        : ref
      : null
  ) as any;
};

function createBaseVNode(
  type,
  props,
  children,
  patchFlag = 0,
  dynamicProps: string[] | null = null,
  shapeFlag = type === Fragment ? 0 : ShapeFlags.ELEMENT,
  isBlockNode = false,
  needFullChildrenNormalization = false
) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
  };

  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    // normalize suspense children
    if (shapeFlag & ShapeFlags.SUSPENSE) {
      type.normalize(vnode);
    }
  } else if (children) {
    // compiled element vnode - if children is passed, only possible types are
    // string or Array.
    vnode.shapeFlag |= isString(children)
      ? ShapeFlags.TEXT_CHILDREN
      : ShapeFlags.ARRAY_CHILDREN;
  }

  // track vnode for block tree
  if (
    isBlockTreeEnabled > 0 &&
    // avoid a block node from tracking itself
    !isBlockNode &&
    // has current parent block
    currentBlock &&
    // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & ShapeFlags.COMPONENT) &&
    // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== PatchFlags.HYDRATE_EVENTS
  ) {
    currentBlock.push(vnode);
  }

  return vnode;
}

export let isBlockTreeEnabled = 1;
export const blockStack = [];
export let currentBlock = null;

export { createBaseVNode as createElementVNode };

export const InternalObjectKey = `__vInternal`;

export function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN;
  } else if (typeof children === "object") {
    if (shapeFlag & (ShapeFlags.ELEMENT | ShapeFlags.TELEPORT)) {
      // Normalize slot to plain children for plain element and Teleport
      const slot = children.default;
      if (slot) {
        // _c marker is added by withCtx() indicating this is a compiled slot
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = ShapeFlags.SLOTS_CHILDREN;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children!)) {
        // if slots are not normalized, attach context instance
        // (compiled / normalized slots already have context)
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === SlotFlags.FORWARDED && currentRenderingInstance) {
        // a child component receives forwarded slots from the parent.
        // its slot type is determined by its parent's slot type.
        if (currentRenderingInstance.slots._ === SlotFlags.STABLE) {
          children._ = SlotFlags.STABLE;
        } else {
          children._ = SlotFlags.DYNAMIC;
          vnode.patchFlag |= PatchFlags.DYNAMIC_SLOTS;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = ShapeFlags.SLOTS_CHILDREN;
  } else {
    children = String(children);
    // force teleport children to array so it can be moved around
    if (shapeFlag & ShapeFlags.TELEPORT) {
      type = ShapeFlags.ARRAY_CHILDREN;
      children = [createTextVNode(children as string)];
    } else {
      type = ShapeFlags.TEXT_CHILDREN;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}

export function createTextVNode(text: string = " ", flag: number = 0) {
  return createVNode(Text, null, text, flag);
}
