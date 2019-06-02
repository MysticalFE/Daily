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
    console.log(result);
    return result;
  };

  //_ each 方法
  _.each = function(target, callback) {
    // console.log(target);
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

  //mixin 将_上所有可枚举的属性方法添加到其prototype上，obj为所有可枚举的属性方法集合
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      // console.log(name);
      const func = obj[name]; //赋值操作是 允许自定义 _ 上定义的方法
      _.prototype[name] = function() {
        console.log(arguments);
        const args = [this._wrapped]; //第一项参数
        Array.prototype.push.apply(arguments, args);
      };
    });
  };
  _.mixin(_);
  root._ = _;
})();
