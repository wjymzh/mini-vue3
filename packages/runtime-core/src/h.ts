// 这个方法是给用户用的。具备多样性

import { isArray, isObject } from "@vue/shared";
import { createVNode, isVnode } from "./vnode";

/**
 * 只有tag
 * 有属性
 * 有一个儿子
 * 有多个儿子
 */

export function h(type, propsChildren, children = null) {
  const l = arguments.length;

  if (l === 2) {
    if (isObject(children) && !isArray(children)) {
      if (isVnode(propsChildren)) {
        //虚拟节点就包装成数组
        return createVNode(type, null, [propsChildren]);
      }
      return createVNode(type, propsChildren);
    } else {
      return createVNode(type, null, propsChildren);
    }
  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2);
    } else if (l === 3 && isVnode(children)) {
      // 等于三个
      children = [children];
    }
    // 其他
    return createVNode(type, propsChildren, children);
  }
}
