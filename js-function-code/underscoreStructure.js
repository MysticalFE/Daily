(function() {
  const root =
    (typeof globalThis == "object" &&
      globalThis.globalThis == globalThis &&
      globalThis) ||
    this ||
    {};

  const _ = function(obj) {
    //obj 是 _ 的实例
    if (obj instanceof _) return obj;
    //obj 不是实例的情况下，返回_的实例对象，以便后续实例方法的调用
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  //对 chain 的进一步判断，链式调用会再将之前的流程走一遍，_(obj).chain()
  function chainResult(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  }

  _.isArray = function(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
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
