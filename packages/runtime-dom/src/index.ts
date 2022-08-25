import { createRenderer } from "@vue/runtime-core";
import { isFunction, isString } from "@vue/shared";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
export * from "@vue/runtime-core";

const renderOption = Object.assign(nodeOps, { patchProp });

export function render(vnode, container) {
  createRenderer(renderOption).render(vnode, container);
}

let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(renderOption));
}

function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}

// 创建app的入口，返回值是一个app
export const createApp = (...args) => {
  // 创建应用
  const app = ensureRenderer().createApp(...args);
  // 先把之前返回的mount存一下
  const { mount } = app;
  // 重写mount
  app.mount = (containerOrSelector) => {
    // 获取容器
    const container = normalizeContainer(containerOrSelector);

    if (!container) return;
    const component = app._component;
    // 判断如果传入的根组件不是函数&根组件没有render函数&没有template，就把容器的内容设置为根组件的template
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    // 清空容器内容
    container.innerHTML = "";

    // 执行缓存的mount方法
    const proxy = mount(container, false, container);
    return proxy;
  };
  return app;
};
