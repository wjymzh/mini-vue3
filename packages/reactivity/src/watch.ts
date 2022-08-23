import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";


//source 是用户传入的数据，cb是回调
export function watch(source,cb){
    let getter
    if(isReactive(source)){
        //  对用户传入数据进行递归循环
        getter = ()=> source
    }

    let oldValue
    const job = ()=>{
        const newValue = effect.run()
        cb(newValue,oldValue)
        oldValue = newValue
    }

   const effect = new ReactiveEffect(getter,job) // 监控自己构造的函数

   return effect.run()
}