import { isArray, isString, ShapeFlags } from "@vue/shared";


export const Text = Symbol('Text')

export function isVnode(value) {
    return !!(value && value.__v_isVnode)
}

// 虚拟节点很多：组件，元素。文本
export function createVnode(type, props, children = null) {
    //组合方案  shapeFlag
    let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0

    //虚拟DOM就是一个对象，方便diff算法，真实DOM自身属性比较多
    const vnode = {
        type,
        props,
        children,
        el:null, //虚拟节点上对应的真是dom
        key: props?.['key'],
        __v_isVnode: true,
        shapeFlag
    }

    if (children) {
        let type = 0
        if (isArray(children)) {
            type = ShapeFlags.ARRAY_CHILDREN;
        } else {
            children = String(children)
            type = ShapeFlags.TEXT_CHILDREN
        }
        vnode.shapeFlag |= type
    }
    return vnode
}