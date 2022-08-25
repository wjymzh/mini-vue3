var VueRuntimeCORE = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, {
            get: () => from[key],
            enumerable:
              !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
          });
    }
    return to;
  };
  var __toCommonJS = (mod) =>
    __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/runtime-core/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Text: () => Text,
    createRenderer: () => createRenderer,
    createVNode: () => createVNode,
    h: () => h,
    isVnode: () => isVnode,
  });

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var NO = () => false;
  var isString = (value) => {
    return typeof value === "string";
  };
  var isArray = Array.isArray;

  // packages/runtime-core/src/apiCreateApp.ts
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {},
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap(),
    };
  }
  var uid = 0;
  function createAppAPI(render, hydrate) {
    return function createApp(rootComponent, rootProps = null) {
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new Set();
      let isMounted = false;
      const app = (context.app = {
        _uid: uid++,
        _component: rootComponent,
        use(plugin, ...options) {
          return app;
        },
        mixin(mixin) {},
        component(name, component) {},
        directive(name, directive) {},
        mount(rootContainer) {},
        unmount() {},
        provide(key, value) {},
      });
      return app;
    };
  }

  // packages/runtime-core/src/vnode.ts
  var Text = Symbol("Text");
  function isVnode(value) {
    return !!(value && value.__v_isVnode);
  }
  function createVNode(type, props, children = null) {
    let shapeFlag = isString(type) ? 1 /* ELEMENT */ : 0;
    const vnode = {
      type,
      props,
      children,
      el: null,
      key: props?.["key"],
      __v_isVnode: true,
      shapeFlag,
    };
    if (children) {
      let type2 = 0;
      if (isArray(children)) {
        type2 = 16 /* ARRAY_CHILDREN */;
      } else {
        children = String(children);
        type2 = 8 /* TEXT_CHILDREN */;
      }
      vnode.shapeFlag |= type2;
    }
    return vnode;
  }

  // packages/runtime-core/src/renderer.ts
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function baseCreateRenderer(renderOptions) {
    const hydrate = false;
    const {
      inset: hostInsert,
      remove: hostRemove,
      setElementText: hostSetElementText,
      setText: hostSetText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      createElement: hostCreateElement,
      createText: hostCreateText,
      patchProp: hostPatchProp,
    } = renderOptions;
    const patch = (n1, n2, container) => {
      if (n1 === n2) return;
      const { type, shapeFlag } = n2;
      if (n1 === null) {
        switch (type) {
          case Text:
            processText(n1, n2, container);
            break;
          default:
            if (shapeFlag & 1 /* ELEMENT */) {
              mountElement(n2, container);
            }
        }
      } else {
      }
    };
    function mountChildren(children, container) {
      for (let i = 0; i < children.length; i++) {
        patch(null, children, container);
      }
    }
    const processElement = () => {};
    function mountElement(vnode, container) {
      let { type, props, children, shapeFlag } = vnode;
      let el = (vnode.el = hostCreateElement(type));
      if (props) {
        for (let key in props) {
          hostPatchProp(el, key, null, props[key]);
        }
      }
      if (shapeFlag & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(children);
      } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
        mountChildren(children, container);
      }
      hostInsert(el, container);
    }
    const processText = (n1, n2, container) => {
      if (n1 === null) {
        hostInsert((n2.el = hostCreateText(n2.children)), container);
      }
    };
    const processFragment = () => {};
    const processComponent = () => {};
    const mountComponent = () => {};
    const setupRenderEffect = () => {};
    const render = (vnode, container) => {
      if (vnode === null) {
      } else {
        patch(container._vnode, vnode, container);
      }
      container._vnode = vnode;
    };
    return {
      render,
      hydrate,
      createApp: createAppAPI(render, hydrate),
    };
  }

  // packages/runtime-core/src/h.ts
  function h(type, propsChildren, children = null) {
    const l = arguments.length;
    if (l === 2) {
      if (isObject(children) && !isArray(children)) {
        if (isVnode(propsChildren)) {
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
        children = [children];
      }
      return createVNode(type, propsChildren, children);
    }
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-core.global.js.map
