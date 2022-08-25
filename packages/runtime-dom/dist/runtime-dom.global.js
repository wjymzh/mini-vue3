var VueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Fragment: () => Fragment,
    InternalObjectKey: () => InternalObjectKey,
    Text: () => Text,
    blockStack: () => blockStack,
    createApp: () => createApp,
    createElementVNode: () => createBaseVNode,
    createRenderer: () => createRenderer,
    createTextVNode: () => createTextVNode,
    createVNode: () => createVNode,
    currentBlock: () => currentBlock,
    h: () => h,
    isBlockTreeEnabled: () => isBlockTreeEnabled,
    isVnode: () => isVnode,
    normalizeChildren: () => normalizeChildren,
    render: () => render
  });

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var NO = () => false;
  var isString = (value) => {
    return typeof value === "string";
  };
  var isFunction = (value) => {
    return typeof value === "function";
  };
  var isArray = Array.isArray;

  // packages/reactivity/src/ref.ts
  function isRef(ref) {
    return !!ref.__V_IS_REF;
  }

  // packages/runtime-core/src/componentRenderContext.ts
  var currentRenderingInstance = null;
  var currentScopeId = null;

  // packages/runtime-core/src/components/Suspense.ts
  var isSuspense = (type) => type.__isSuspense;
  var isTeleport = (type) => type.__isTeleport;

  // packages/runtime-core/src/vnode.ts
  var Fragment = Symbol("Fragment");
  var Text = Symbol("Text");
  function isVnode(value) {
    return !!(value && value.__v_isVnode);
  }
  function createVNode(type, props, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (props) {
    }
    const shapeFlag = isString(type) ? 1 /* ELEMENT */ : isSuspense(type) ? 128 /* SUSPENSE */ : isTeleport(type) ? 64 /* TELEPORT */ : isObject(type) ? 4 /* STATEFUL_COMPONENT */ : isFunction(type) ? 2 /* FUNCTIONAL_COMPONENT */ : 0;
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
  var normalizeKey = ({ key }) => key != null ? key : null;
  var normalizeRef = ({ ref, ref_key, ref_for }) => {
    return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for } : ref : null;
  };
  function createBaseVNode(type, props, children, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1 /* ELEMENT */, isBlockNode = false, needFullChildrenNormalization = false) {
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
      appContext: null
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128 /* SUSPENSE */) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 /* TEXT_CHILDREN */ : 16 /* ARRAY_CHILDREN */;
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6 /* COMPONENT */) && vnode.patchFlag !== 32 /* HYDRATE_EVENTS */) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  var isBlockTreeEnabled = 1;
  var blockStack = [];
  var currentBlock = null;
  var InternalObjectKey = `__vInternal`;
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type = 16 /* ARRAY_CHILDREN */;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 /* ELEMENT */ | 64 /* TELEPORT */)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type = 32 /* SLOTS_CHILDREN */;
        const slotFlag = children._;
        if (!slotFlag && !(InternalObjectKey in children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 /* FORWARDED */ && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1 /* STABLE */) {
            children._ = 1 /* STABLE */;
          } else {
            children._ = 2 /* DYNAMIC */;
            vnode.patchFlag |= 1024 /* DYNAMIC_SLOTS */;
          }
        }
      }
    } else if (isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type = 32 /* SLOTS_CHILDREN */;
    } else {
      children = String(children);
      if (shapeFlag & 64 /* TELEPORT */) {
        type = 16 /* ARRAY_CHILDREN */;
        children = [createTextVNode(children)];
      } else {
        type = 8 /* TEXT_CHILDREN */;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }

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
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  var uid = 0;
  function createAppAPI(render2, hydrate) {
    return function createApp2(rootComponent, rootProps = null) {
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new Set();
      let isMounted = false;
      const app = context.app = {
        _uid: uid++,
        _component: rootComponent,
        _container: null,
        _instance: null,
        use(plugin, ...options) {
          return app;
        },
        mixin(mixin) {
        },
        component(name, component) {
        },
        directive(name, directive) {
        },
        mount(rootContainer, isHydrate, isSVG) {
          if (!isMounted) {
            const vnode = createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            render2(vnode, rootContainer, isSVG);
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            app._instance = vnode.component;
            return vnode;
          }
        },
        unmount() {
        },
        provide(key, value) {
        }
      };
      return app;
    };
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
      patchProp: hostPatchProp
    } = renderOptions;
    const patch = (n1, n2, container) => {
      if (n1 === n2)
        return;
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
    const processElement = () => {
    };
    function mountElement(vnode, container) {
      let { type, props, children, shapeFlag } = vnode;
      let el = vnode.el = hostCreateElement(type);
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
        hostInsert(n2.el = hostCreateText(n2.children), container);
      }
    };
    const processFragment = () => {
    };
    const processComponent = () => {
    };
    const mountComponent = () => {
    };
    const setupRenderEffect = () => {
    };
    const render2 = (vnode, container) => {
      if (vnode === null) {
        if (container._vnode) {
        }
      } else {
        patch(container._vnode || null, vnode, container);
      }
      container._vnode = vnode;
    };
    return {
      render: render2,
      hydrate,
      createApp: createAppAPI(render2, hydrate)
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

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    insert(child, parent, anchor = null) {
      parent.insertBefore(child, anchor);
    },
    remove(child) {
      const parentNode = child.parentNode;
      if (parentNode) {
        parentNode.removeChild(child);
      }
    },
    setElementText(el, text) {
      el.textContent = text;
    },
    setText(node, text) {
      node.nodeValue = text;
    },
    querySelector(selector) {
      return document.querySelector(selector);
    },
    parentNode(node) {
      return node.parentNode;
    },
    nextSibling(node) {
      return node.nextSibling;
    },
    createElement(tagName) {
      return document.createElement(tagName);
    },
    createText(text) {
      return document.createTextNode(text);
    }
  };

  // packages/runtime-dom/src/modules/attr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue) {
      el.setAttribute(key, nextValue);
    } else {
      el.removeAttribute(key);
    }
  }

  // packages/runtime-dom/src/modules/class.ts
  function patchClass(el, nextValue) {
    if (nextValue === null) {
      el.removeAttribute("class");
    } else {
      el.className = nextValue;
    }
  }

  // packages/runtime-dom/src/modules/event.ts
  function createInvoker(callback) {
    const invoker = (e) => invoker.value(e);
    invoker.value = callback;
  }
  function patchEvent(el, eventName, nextValue) {
    let invokers = el._vei || (el._vei = {});
    let exits = invokers[eventName];
    if (exits) {
      exits.value = nextValue;
    } else {
      let event = eventName.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = invokers[eventName] = createInvoker(nextValue);
        el.addEventListener(event, invoker);
      } else if (exits) {
        el.removeEventListener(event, exits);
        invokers[eventName] = void 0;
      }
    }
  }

  // packages/runtime-dom/src/modules/style.ts
  function patchStyle(el, prevValue, nextValue) {
    for (let key in nextValue) {
      el.style[key] = nextValue[key];
    }
    if (prevValue) {
      for (let key in prevValue) {
        if (nextValue[key] === null) {
          el.style[key] = null;
        }
      }
    }
  }

  // packages/runtime-dom/src/patchProp.ts
  function patchProp(el, key, prevValue, nextValue) {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (/^on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  }

  // packages/runtime-dom/src/index.ts
  var renderOption = Object.assign(nodeOps, { patchProp });
  function render(vnode, container) {
    createRenderer(renderOption).render(vnode, container);
  }
  var renderer;
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
  var createApp = (...args) => {
    const app = ensureRenderer().createApp(...args);
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container)
        return;
      const component = app._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      container.innerHTML = "";
      const proxy = mount(container, false, container);
      return proxy;
    };
    return app;
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
