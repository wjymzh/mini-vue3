import { patchAttr } from "./modules/attr";
import { patchClass } from "./modules/class";
import { patchEvent } from "./modules/event";
import { patchStyle } from "./modules/style";


// DOM属性的操作API
export function patchProp(el, key, prevValue, nextValue) {
    // 类名  class
    // 样式  style
    // event
    // 属性

    if (key === 'class') {
        patchClass(el,nextValue)
    } else if (key === 'style') {
        patchStyle(el,prevValue,nextValue)
    } else if (/^on[^a-z]/.test(key)) {
        patchEvent(el,key,nextValue)
    } else {
        patchAttr(el,key,nextValue)
    }
}