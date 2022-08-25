import { NOOP, ShapeFlags } from "@vue/shared";
import { createAppAPI } from "./apiCreateApp";
import { createComponentInstance } from "./component";
import { Fragment, Static, Text } from "./vnode";

export function createRenderer(options) {
  return baseCreateRenderer(options);
}

function baseCreateRenderer(renderOptions) {
  const hydrate = false; // 服务端渲染，不关心
  // 通用的DOM操作方法
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    cloneNode: hostCloneNode,
    insertStaticContent: hostInsertStaticContent
  } = renderOptions;

  // =======================
  // 渲染的核心流程
  // 通过闭包缓存内敛函数
  // =======================

  // 核心diff过程
  const patch = (n1,
    n2,
    container,
    anchor = null,
    parentComponent = null,
    parentSuspense = null,
    isSVG = false,
    slotScopeIds = null,
    optimized = false) => {

      if (n1 === n2) {
        return
      }

    // 核心的patch
    const { type, ref, shapeFlag } = n2
  switch (type) {
    case Text:
      // 处理文本
      processText(n1, n2, container, anchor)
      break
    case Comment:
      // 注释节点
      processCommentNode(n1, n2, container, anchor)
      break
    case Static:
      // 静态节点
      if (n1 == null) {
        mountStaticNode(n2, container, anchor, isSVG)
      }
      break
    case Fragment:
      // fragment节点
      processFragment()
      break
    default:
      if (shapeFlag & 1 /* ELEMENT */) {	// 处理DOM元素
        processElement(n1, n2, container)
      }
      else if (shapeFlag & 6 /* COMPONENT */) {	// 处理组件
        processComponent(n1, n2, container,...)
      }
      else if (shapeFlag & 64 /* TELEPORT */) {
        type.process(n1, n2, container, ...);
      }
      else if (shapeFlag & 128 /* SUSPENSE */) {
        type.process(n1, n2, container, ...);
      }
  }
  };
  // 挂载子节点
  function mountChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
      patch(null, children, container);
    }
  }

  const processElement = () => {}; // 处理element


  const mountStaticNode = (
    n2,
    container,
    anchor,
    isSVG
  ) => {
    // static nodes are only present when used with compiler-dom/runtime-dom
    // which guarantees presence of hostInsertStaticContent.
    ;[n2.el, n2.anchor] = hostInsertStaticContent!(
      n2.children as string,
      container,
      anchor,
      isSVG,
      n2.el,
      n2.anchor
    )
  }

  const processCommentNode = (
    n1,
    n2,
    container,
    anchor
  ) => {
    if (n1 == null) {
      hostInsert(
        (n2.el = hostCreateComment((n2.children as string) || '')),
        container,
        anchor
      )
    } else {
      // there's no support for dynamic comments
      n2.el = n1.el
    }
  }
  // 挂载element
  function mountElement(vnode, container) {
    let { type, props, children, shapeFlag } = vnode;
    let el = (vnode.el = hostCreateElement(type));
    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      //孩子节点是文本
      hostSetElementText(children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, container);
    }
    hostInsert(el, container);
  }

  const processText = (n1, n2, container,anchor) => {
    if (n1 == null) {
      hostInsert(
        (n2.el = hostCreateText(n2.children as string)),
        container,
        anchor
      )
    } else {
      const el = (n2.el = n1.el!)
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children as string)
      }
    }
  };

  const processFragment = () => {}; // 处理fragment节点

  const processComponent = (n1, n2, container) => {
    if (n1 == null) {
     
        // 挂载组件
        mountComponent(n2, container, ...);
    
    }
    else {
      // 更新组件
      updateComponent(n1, n2, optimized);
    }
  }; // 处理组件

  const mountComponent = (initialVNode, container) => {
    // 1. 创建组件实例
    const instance = (
      // 这个时候就把组件实例挂载到了组件vnode的component属性上了
      initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense)
    );
    // 2. 设置组件实例
    setupComponent(instance);
    // 3. 设置并运行带有副作用的渲染函数
    setupRenderEffect(instance, initialVNode, container);
  }; // 挂载组件

  const setupRenderEffect = () => {}; // 运行带副作用的render函数

  const render = (vnode, container) => {
    //渲染过程

    // 如果vnode是空，卸载逻辑
    if (vnode === null) {
      // 卸载逻辑
      if (container._vnode) {
        // 卸载组件
        // unmount();
      }
    } else {
      // 这里既有初始化也有更新逻辑`
      patch(container._vnode || null, vnode, container);
    }
    container._vnode = vnode;
  };

  // =======================
  // 🐶2000+行的内敛函数🐶
  // =======================

  return {
    render,
    hydrate, // 服务端渲染相关
    createApp: createAppAPI(render, hydrate),
  };
}
