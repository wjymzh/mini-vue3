import { isFunction } from "@vue/shared"
import { ReactiveEffect, trackEffects, triggerEffects} from './effect'

class ComputedRefImpl {
    public effect
    public _dirty = true // 默认应该取值的时候计算
    public  __v_isReadonly = true
    public _v_isRef = true
    public _value;
    public dep  = new Set
    
    constructor( getter,public setter){
        this.effect =   new ReactiveEffect(getter,()=>{
                // 稍后依赖的属性发生变化时，会执行此调度函数
                if(!this._dirty){
                    this._dirty = true
                    // 实现触发更新
                    triggerEffects(this.dep)
                }
        })
    }
    // 类中的属性访问器
    get value(){

        // 实现依赖收集
        trackEffects(this.dep)

        if(this._dirty){
            // 说明这个值是脏的
           this._value =  this.effect.run()
        }


        return this._value
    }
    set value(newValue){
            this.setter(newValue)
    }
}


export const computed = (getterOrOptions)=>{
    let onlyGetter =   isFunction(getterOrOptions)
    let getter
    let setter

    if(onlyGetter){
        getter = getterOrOptions
        setter = () =>{console.warn('no set')}
    }else{
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }

    return new ComputedRefImpl(getter,setter)
}

