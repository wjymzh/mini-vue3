import { createRenderer } from "@vue/runtime-core";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";

const renderOption = Object.assign(nodeOps,{patchProp})

export function render(vnode,container){
    createRenderer(renderOption).render(vnode,container)
}

export * from '@vue/runtime-core'