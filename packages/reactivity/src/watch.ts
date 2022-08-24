import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";

// 考虑对象中有循环引用问题
function traversal(value, set = new Set()) {
  // 终结条件：不是对象就不再递归
  if(!isObject(value)) return value
  if(set.has(value)){
    return value
  }
  
  set.add(value)

  for(let key in value){
    traversal(value[key],set)
  }
  return value
}

//source 是用户传入的数据，cb是回调
export function watch(source, cb) {
  let getter;
  if (isReactive(source)) {
    //  对用户传入数据进行递归循环
    getter = () => traversal(source); // 把对象内属性进行遍历
  }else if(isFunction(source)){
    getter = source
  }else{
    return
  }

  let cleanup
  const onCleanup = (fn)=>{
    cleanup = fn
  }

  let oldValue;
  const job = () => {
    if(cleanup) cleanup()
    const newValue = effect.run();
    cb(newValue, oldValue,onCleanup);
    oldValue = newValue;
  };

  const effect = new ReactiveEffect(getter, job); // 监控自己构造的函数

  return effect.run();
}
