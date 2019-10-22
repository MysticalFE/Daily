/**
 * 观察者模式(发布/订阅模式)
 * 一对多的状态，发布: 一个对象改变，订阅：多个对象可以同时改变
 * 发布者，订阅者统一通过事件中心处理
 * 观察者模式 一次触发所有的订阅，也就是被观察对象
 */
class Observer {
  constructor() {
    this.subscribers = [];
  }

  //持续订阅事件
  on(topic, cb) {
    const currentTopic = { topic, cb },
      //every 数组为空时，在一切情况下都会返回 true
      hasContain =
        this.subscribers.length > 0
          ? this.subscribers.every(item => item.topic === topic)
          : false;
    // hasContain =
    //   this.subscribers.findIndex(item => item.topic === topic) != -1;
    hasContain
      ? this.subscribers.map(item => {
          if (item.topic === topic) {
            item.cb = cb;
          }
        })
      : this.subscribers.push(currentTopic);
  }

  //只订阅一次事件
  once(topic, cb) {
    const oneTime = () => {
      //先执行回调，然后清除该事件的对应回调
      cb.apply(this, arguments);
      this.off(event);
    };
    oneTime.cbName = cb;
    this.on(topic, oneTime);
  }

  //发布事件，并传入相应的参数
  emit(topic, ...args) {
    // const currentTopic = this.subscribers.filter(item => item.topic === topic);
    this.subscribers.forEach(item => {
      if (item.topic === topic) item.cb.apply(this, args);
    });
  }

  //取消订阅事件
  off(topic) {
    if (!topic) {
      this.subscribers = [];
    } else {
      const currentIndex = this.subscribers.findIndex(
        item => item.topic === topic
      );
      this.subscribers.splice(currentIndex, 1);
    }
  }
}
