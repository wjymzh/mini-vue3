import { activeEffect,track,trigger } from "./effect"

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
       return Reflect.get(target,key,receiver)
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