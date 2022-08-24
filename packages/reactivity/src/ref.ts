import { isObject, hasChanged } from "@vue/shared";
import { shallowUnwrapHandlers } from "./baseHandler";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { isReactive, reactive } from "./reactive";

export class RefImpl {
  public _rawValue; // 原始值
  public _value; // 处理后的值
  public dep; // 依赖集合
  public __V_IS_REF = true;

  constructor(value) {
    this._rawValue = value;
    // 看看value 是不是一个对象，如果是一个对象的话
    // 那么需要用 reactive 包裹一下
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    // 防止 赋相同的值
    // 会导致重新 trigger
    if (!hasChanged(newValue, this._rawValue)) return;
    // set
    this._value = convert(newValue);
    this._rawValue = newValue;
    // trigger 触发副作用
    triggerEffects(this.dep);
  }
}

export function ref(value) {
  return createRef(value);
}

function createRef(value) {
  const refImpl = new RefImpl(value);

  return refImpl;
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
  // 如果可以收集依赖
  // 防止没调用 effect 直接 get
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

// 判断是否是refImpl对象
export function isRef(ref) {
  return !!ref.__V_IS_REF;
}

export function unRef(raw) {
  return isRef(raw) ? raw.value : raw;
}

// 给ref解包
export function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs)
    ? objectWithRefs
    : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
