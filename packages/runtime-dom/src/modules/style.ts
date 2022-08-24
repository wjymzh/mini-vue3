export function patchStyle(el,prevValue,nextValue){
    // 样式需要比对差异
    for(let key in nextValue){
        // 用心的覆盖即可
        el.style[key] = nextValue[key]
    }

    if(prevValue){
        for(let key in prevValue){
            if(nextValue[key] === null){
                el.style[key] = null
            }
        }
    }
}