import { NO } from "@vue/shared";
import { createVNode } from "./vnode";

// 创建vue应用上下文
export function createAppContext() {
  return {
    app: null as any,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: undefined,
      warnHandler: undefined,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  };
}

let uid = 0;
export function createAppAPI(render, hydrate) {
  // 真正创建app的入口
  return function createApp(rootComponent, rootProps = null) {
    // 创建vue应用上下文
    const context = createAppContext();
    // 已安装的vue插件
    const installedPlugins = new Set();
    let isMounted = false;
    const app = (context.app = {
      _uid: uid++,
      _component: rootComponent, // 根组件
      _container: null,
      _instance: null,
      use(plugin, ...options) {
        // ...
        return app;
      },
      mixin(mixin) {},
      component(name, component) {},
      directive(name, directive) {},
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          // 创建根组件对应的vnode
          const vnode = createVNode(rootComponent, rootProps);
          // 根级vnode存在应用上下文
          vnode.appContext = context;
          // 将虚拟vnode节点渲染成真实节点，并挂载
          render(vnode, rootContainer, isSVG);
          isMounted = true;
          // 记录应用的根组件容器
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          app._instance = vnode.component;
          return vnode;
        }
      },
      unmount() {},
      provide(key, value) {},
    });
    return app;
  };
}
