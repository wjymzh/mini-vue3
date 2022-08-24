import { ShapeFlags } from "@vue/shared"
import { Text } from "./vnode"




export function createRenderer(renderOptions) {

    let {
        inset: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText,
        setText: hostSetText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        createElement: hostCreateElement,
        createText: hostCreateText,
        patchProp:hostPatchProp
    } = renderOptions

    function mountChildren (children,container){
            for(let i = 0;i<children.length;i++){
                patch(null,children,container)
            }
    }

    function mountElement(vnode, container) {
        let { type, props,children,shapeFlag } = vnode
       let el =  vnode.el = hostCreateElement(type)
        if(props){ 
            for(let key in props){
                hostPatchProp(el,key,null,props[key])
            }
        }
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){   //孩子节点是文本
                    hostSetElementText(children)
        }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
            mountChildren(children,container)
        }
        hostInsert(el,container)
    }

    const processText = (n1, n2, container)=>{
            if(n1 === null){
                // 初始化
                hostInsert(n2.el = hostCreateText(n2.children),container)
            }
    }

    const patch = (n1, n2, container) => {
        // 核心的patch
        if (n1 === n2) return

        const { type,shapeFlag} = n2
        if (n1 === null) {
            //初始渲染  还有组件的初次渲染
            switch(type){
                case Text:
                    processText(n1, n2, container)
                    break;
                default:
                    if(shapeFlag &ShapeFlags.ELEMENT){
                        mountElement(n2, container)
                    }
            }
           
        } else {
            // 更新流程
        }
    }

    const render = (vnode, container) => { //渲染过程

        // 如果vnode是空，卸载逻辑
        if (vnode === null) {
            // 卸载逻辑
        } else {
            // 这里既有初始化也有更新逻辑
            patch(container._vnode, vnode, container)
        }
        container._vnode = vnode
    }

    return {
        render
    }
}