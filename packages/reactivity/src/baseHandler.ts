import { isObject } from "@vue/shared"
import { activeEffect,track,trigger } from "./effect"
import { reactive } from "./reactive"

export const enum reactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers = {
    get(target,key,receiver){
        if(key === reactiveFlags.IS_REACTIVE){
            true
        }
        // 让effect和key进行关联
        track(target,'get',key)

        // 这里可以监控用户取值
       let res =  Reflect.get(target,key,receiver)
       if(isObject(res)){
        return reactive(res)
       }
       return res
    },
    set(target,key,value,receiver){
        let oldValue = target[key]
        // 这里可以监控用户设置值
        let result =  Reflect.set(target,key,value,receiver)

        if(oldValue !== value){
            // 值不相等，出发更新
            trigger(target,'set',key,value,oldValue)
        }
        return result
    }
}