export const nodeOps = {
    // 增加  删除  修改  查询
    insert(child, parent, anchor = null) {
        parent.insertBefore(child, anchor)  //等价于appendChild
    },
    // 删除节点
    remove(child) {
        const parentNode = child.parentNode
        if (parentNode) {
            parentNode.removeChild(child)
        }
    },
    // 修改  文本节点  元素中的内容
    setElementText(el, text) {
        el.textContent = text
    },
    setText(node, text) {
        node.nodeValue = text
    },
    querySelector(selector){
        return document.querySelector(selector)
    },
    parentNode(node){
        return node.parentNode
    },
    nextSibling(node){
        return node.nextSibling
    },
    createElement(tagName){
        return document.createElement(tagName)
    },
    createText(text){
        return document.createTextNode(text)
    }
}