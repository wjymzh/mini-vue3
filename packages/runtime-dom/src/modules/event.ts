function createInvoker(callback) {
    const invoker = (e) => invoker.value(e)
    invoker.value = callback
}

export function patchEvent(el, eventName, nextValue) {
    // 先移除事件，在重新绑定事件
    let invokers = el._vei || (el._vei = {})

    let exits = invokers[eventName]  //先看有没有缓存

    if (exits) { //已经绑定过
        exits.value = nextValue
    } else { // 没有绑定过
        let event = eventName.slice(2).toLowerCase();
        if (nextValue) {
            const invoker = invokers[eventName] = createInvoker(nextValue)
            el.addEventListener(event, invoker)
        }else if(exits){ //如果有老值，要将老事件移除
            el.removeEventListener(event,exits)
            invokers[eventName] = undefined
        }
    }
}