(function() {
  const root =
    (typeof globalThis == "object" &&
      globalThis.globalThis == globalThis &&
      globalThis) ||
    this ||
    {};
  const objProto = Object.prototype;
  const toSring = objProto.toString;
  const Ctor = function() {};
  const _ = function(obj) {
    //obj 是 _ 的实例
    if (obj instanceof _) return obj;
    //obj 不是实例的情况下，返回_的实例对象，以便后续实例方法的调用
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };
  const privateRoot = root._;
  //对 chain 的进一步判断，链式调用会再将之前的流程走一遍，_(obj).chain()
  function chainResult(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  }

  _.isArray = function(arr) {
    return Array.isArray || toString.call(arr) === "[object Array]";
  };

  _.isObject = function(obj) {
    return toSring.call(obj) === "[object Object]";
  };

  //obj 所有可枚举的属性方法集合
  _.functions = function(obj) {
    let result = [];
    for (let key in obj) {
      result.push(key);
    }
    return result;
  };

  //数组去重
  _.unique = function(array, callback) {
    let result = [],
      targetEle;
    for (let i = 0; i < array.length; i++) {
      targetEle = callback ? callback[i] : array[i];
      if (!result.includes(targetEle)) {
        result.push(targetEle);
      }
    }
    // console.log(result);
    return result;
  };

  //_ each 方法
  _.each = function(target, callback) {
    console.log(target);
    if (_.isArray(target)) {
      for (let i = 0; i < target.length; i++) {
        callback.call(target, target[i], i);
      }
    } else {
      for (let key in target) {
        callback.call(target, key, target[key]);
      }
    }
  };
  _.map = function(target) {
    target.push("wo");
    return target;
  };

  _.noConflict = function() {
    root._ = privateRoot;
    return this;
  };

  //rest参数， es5实现es6中 ...rest 剩余参数
  _.restArguments = function(func) {
    const startIndex = func.length - 1; //rest参数索引
    return function() {
      const length = arguments.length - startIndex, //rest数组长度
        rest = Array(length);
      for (let i = 0; i < length; i++) {
        rest[i] = arguments[i + startIndex]; //rest参数成员变量
      }
      const args = Array(startIndex + 1); //func传入的参数数组集合
      for (let i = 0; i < startIndex; i++) {
        args[i] = arguments[i]; //除rest以外的参数
      }
      args[startIndex] = rest;
      return func.apply(this, args); //this指向当前 restArguments  调用的参数(1,2,3,4,5)
    };
  };

  //获取当前时间戳
  _.now = Date.now || (() => new Date().getTime());
  /**
   * fn 节流
   * func 处理函数
   * wait 等待时间  最多每搁 wait 毫秒调用一次 func
   * options
   * options 解决了两个问题，1.初始化是否马上执行func,默认执行，如禁用，options = {leading: false}
   * 2.如果想禁止func最后一次调用，options = {trailing: false}  默认执行
   */
  _.throttle = function(func, wait, options) {
    let context,
      args,
      timeout = null,
      result;
    let previousTime = 0;
    console.log(`${previousTime}---init`);
    if (!options) options = {};

    //setTimeout 回调函数
    const later = () => {
      previousTime = options.leading === false ? 0 : _.now();
      console.log(`${previousTime}---later`);
      timeout = null;
      result = func.apply(context, args);
    };

    const throttled = function() {
      const now = _.now();
      context = this;
      args = arguments;
      //初始化设置leading: false
      if (!previousTime && options.leading === false) {
        previousTime = now;
      }
      console.log(`${previousTime}---throttled`);
      console.log(`${now}---now`);
      //setTimeout 时间间隔
      const remaining = wait - (now - previousTime);
      console.log(remaining);
      // 初始化没有设置leading: false
      if (remaining <= 0 || remaining > wait) {
        //如果timeout存在
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previousTime = now;
        console.log(`打印${previousTime}`);
        result = func.apply(context, args); //调用func,并传递args参数
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
    return throttled;
  };

  //fn 防抖
  _.debounce = function() {};
  //Object.create() polyfill
  const baseCreate = function(proto) {
    if (!_.isObject(proto)) return;
    if (Object.create) return Object.create(proto); //判断是否支持Object.create 方法
    Ctor.prototype = proto;
    const newProto = new Ctor();
    Ctor.prototype = null; //因为Ctor是全局变量，这一步是将上面定义函数原型设置为null，不影响其他定义的方法使用该全局变量
    return newProto;
  };
  //统一返回 链式调用的 this 实例
  _.chain = function(obj) {
    const instance = _(obj);
    instance._chain = true;
    return instance;
  };

  //返回处理后的数据
  // _.values = function(target) {
  //   // console.log(target);
  //   return target;
  // };

  //返回处理后的数据
  _.prototype.value = function() {
    return this._wrapped;
  };
  //mixin 将_上所有可枚举的属性方法添加到其prototype上，obj为所有可枚举的属性方法集合
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      // console.log(name);
      const func = obj[name]; //赋值操作是 允许自定义 _ 上定义的方法
      _.prototype[name] = function() {
        // console.log(arguments);
        //this 指向当前_的实例,链式调用需要每次调用返回当前this的实例
        const args = [this._wrapped]; //第一项参数
        Array.prototype.push.apply(args, arguments); //将args传入需要处理的原数据 与 调用的实例方法传入的arguments合并
        // console.log(func.apply(_, args));
        return chainResult(this, func.apply(this, args));
      };
    });
  };
  _.mixin(_);
  root._ = _;
})();
