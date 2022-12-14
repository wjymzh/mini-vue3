export let activeEffect = undefined;
// 多对多
const targetMap = new WeakMap();
// 全局 track 开关 防止 obj.x ++ 会重新触发依赖收集 导致 stop 无效
let shouldTrack: boolean;

function cleanupEffect(effect) {
  const { deps } = effect;
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect); // 接触effect，重新依赖收集
  }
  effect.deps.length = 0;
}

export class ReactiveEffect {
  public parent = null;
  public deps = []; //记录当前effect依赖了那些属性
  public active = true; //默认是激活状态，等价于 this.active = true
  constructor(public fn, public scheduler) {}
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

  stop() {
    if (this.active) {
      this.active = false;
      cleanupEffect(this);
    }
  }
}

export function effect(fn, options: any = {}) {
  // 这里fn可以根据状态变化，重新执行，effect可以嵌套写

  const _effect = new ReactiveEffect(fn, options.scheduler);

  _effect.run(); // 默认先执行一次

  const runner = _effect.run.bind(_effect);

  runner.effect = _effect; //
  return runner;
}

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
  trackEffects(dep);
}
export function trackEffects(dep) {
  if (activeEffect) {
    //  判断是否需要进行依赖收集
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      // effect 和数据双向收集
      dep.add(activeEffect);
      activeEffect.deps.push(dep); //清理需要
    }
  }
}

// 是否可以被收集
export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return; // 触发的值不在模板中使用

  let effects = depsMap.get(key); //属性对应的effects

  // 永远在关联之前 先拷贝一份，不要关联引用
  if (effects) {
    triggerEffects(effects);
  }
}

export function triggerEffects(effects) {
  effects = new Set(effects);
  effects.forEach((effect) => {
    // 在执行effect的时候，又要执行自己，那我们需要屏蔽，不要无线调用
    if (effect !== activeEffect) {
      if (effect.scheduler) {
        effect.scheduler(); //如果传入的是调度函数，就用用户的
      } else {
        effect.run(); //否则默认刷新试图
      }
    }
  });
}
