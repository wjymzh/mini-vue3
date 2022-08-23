import { isObject } from "@vue/shared";
import {mutableHandlers,reactiveFlags} from './baseHandler'


const reactiveMap = new WeakMap() //key 只能是对象

export function isReactive(value){
    return value && value[reactiveFlags.IS_REACTIVE]

}

// 将数据转换成响应式数据
export function reactive(target){
        if(!isObject(target))  {
            return
        }  

        if(target[reactiveFlags.IS_REACTIVE]){  //如果是代理对象，第二次一定是会出发get
            return target
        }
        
        // 如果已经进行过响应式初始化，则直接返回代理对象
        let exisitingProxy = reactiveMap.get(target)
        if(exisitingProxy){
            return exisitingProxy
        }

        // 第一次普通对象会进行new proxy代理一次
        // 下一次判断是否有get方法，如果有，则是

     const proxy = new Proxy(target,mutableHandlers)
     reactiveMap.set(target,proxy )
     return proxy
}