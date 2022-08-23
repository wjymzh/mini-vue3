export let activeEffect = undefined;

function cleanupEffect(effect) {
  const { deps } = effect;
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect); // 接触effect，重新依赖收集
  }
  effect.deps.length = 0;
}

class ReactiveEffect {
  public parent = null;
  public deps = []; //记录当前effect依赖了那些属性
  public active = true; //默认是激活状态，等价于 this.active = true
  constructor(public fn) {}
  run() {
    // 执行effect
    if (!this.active) {
      this.fn;
    } // 如果是非激活情况，只执行函数，不进行依赖收集

    //进行依赖收集  核心就是当当前的effect和稍后渲染的属性关联在一起
    try {
      this.parent = activeEffect;
      activeEffect = this;

      // 需要在用户执行函数之前，把之前收集的内容清空
      cleanupEffect(this);

      return this.fn();
    } finally {
      activeEffect = this.parent;
    }
  }
}

export function effect(fn) {
  // 这里fn可以根据状态变化，重新执行，effect可以嵌套写

  const _effect = new ReactiveEffect(fn);

  _effect.run();
}

// 多对多
const targetMap = new WeakMap();
export function track(target, type, key) {
  if (!activeEffect) return; // 如果没有effect，什么都不做
  let depsMap = targetMap.get(target); //第一次没有
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  //  判断是否需要进行依赖收集
  let shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    // effect 和数据双向收集
    dep.add(activeEffect);
    activeEffect.deps.push(dep); //清理需要
  }
}

export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return; // 触发的值不在模板中使用

  let effects = depsMap.get(key); //属性对应的effects

  // 永远在关联之前 先拷贝一份，不要关联引用
  if (effects) {
    effects = new Set(effects);
    effects.forEach((effect) => {
      // 在执行effect的时候，又要执行自己，那我们需要屏蔽，不要无线调用
      if (effect !== activeEffect) effect.run();
    });
  }
}
