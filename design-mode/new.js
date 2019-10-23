import { resolve } from "path";

//new 操作符
function customNew(func, ...args) {
  const obj = Object.create(null); //创建了一个空对象
  obj.__proto__ = func.prototype; //obj作为构造函数中的this，需要继承到func自身属性以及其原型
  const result = func.apply(obj, args);
  return result instanceof Object ? result : obj; //如果有return 对象的话，调用并返回该对象; return 非对象的话，忽略
}

//call实现
Function.prototype.call = function(context = window) {
  //临时将函数添加到context属性中
  context.fn = this;
  const args = Array.from(arguments).slice(1);
  // const args = [...arguments].slice(1);
  const result = context.fn(...args);
  delete context.fn;
  return result;
};

//apply实现
Function.prototype.apply = function(context = window) {
  context.fn = this;
  const result = arguments[1] ? context.fn(...arguments[1]) : context.fn();
  delete context.fn;
  return result;
};

//bind实现
Function.prototype.bind = function() {
  //a = a.bind(this);
  //this是指a
  const _this = this;
  const args = Array.from(arguments);

  if (typeof _this != "function") throw Error(`${this}必须是函数`);
  //args.bind(this, 1)(2, 3);
  const resFunc = function() {
    // console.log(...args, "ewqewqewqe");
    // console.log(...arguments, "gfgfdgd");
    return _this.call(...args, ...arguments);
  };

  //在new bind之后的构造函数时，因为this指向是不变的，一直指向bind之后的函数对象，这里对bind函数原型还原清空，保持每个操作中this指向当前实例后的对象或者构造函数
  const temp = function() {};
  resFunc.prototype = temp.prototype;
  return resFunc;
};
// function foo(name) {
//   this.name = name;
//   console.log(this);
// }
// var obj = {};
// var bar = foo.bind(obj);
// bar("Jack");
// var alice = new bar("Alice");
// console.log(obj.name); // Alice
// console.log(alice); // undefined
