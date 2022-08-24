import { isObject } from "@vue/shared";
import { activeEffect, track, trigger } from "./effect";
import { reactive } from "./reactive";
import { isRef, unRef } from "./ref";

export const enum reactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers = {
  get(target, key, receiver) {
    if (key === reactiveFlags.IS_REACTIVE) {
      true;
    }
    // 让effect和key进行关联
    track(target, "get", key);

    // 这里可以监控用户取值
    let res = Reflect.get(target, key, receiver);
    if (isObject(res)) {
      return reactive(res);
    }
    return res;
  },
  set(target, key, value, receiver) {
    let oldValue = target[key];
    // 这里可以监控用户设置值
    let result = Reflect.set(target, key, value, receiver);

    if (oldValue !== value) {
      // 值不相等，出发更新
      trigger(target, "set", key, value, oldValue);
    }
    return result;
  },
};

export const shallowUnwrapHandlers = {
  // 在 get 时调用 unRef 拆包
  get(target: any, key: string) {
    return unRef(Reflect.get(target, key));
  },
  set(target: any, key: string, value: any) {
    // 如果 set 的目标是 ref
    // 并且
    // set value 不是 ref
    // 就给目标 ref 直接 .value 赋值
    if (isRef(target[key]) && !isRef(value)) {
      return (target[key].value = value);
    } else {
      // 目标不是 ref
      // 或者
      // set value 是 ref
      return Reflect.set(target, key, value);
    }
  },
};
