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

/**
 * 查找最长无重复的字串
 * //s "bbbb"
'p' => 'pw' => 'w' => 'wk' => 'wke'
 */
function lengthOfLongestSubstring(s) {
  // let str = "";
  // let size = 0;
  // for (let i = 0; i < s.length; i++) {
  //   const index = str.indexOf(s[i]);
  //   // console.log(str);
  //   if (index == -1) {
  //     str += s[i];
  //     //size 取的上次循环中 str.length
  //     size = size < str.length ? str.length : size;
  //   } else {
  //     str = str.slice(index + 1) + s[i];
  //   }
  // }
  // console.log(str);
  // return size;
  const map = {};
  var left = 0;

  return s.split("").reduce((max, v, i) => {
    left = map[v] >= left ? map[v] + 1 : left;
    map[v] = i;
    // console.log(left);
    return Math.max(max, i - left + 1);
  }, 0);
}
lengthOfLongestSubstring("abcabcbb");
// lengthOfLongestSubstring("bbbbb");
// lengthOfLongestSubstring("pwwkew");

/**
 * 查找所有无重复字符串
 */
function getAllString(str) {
  let res = [];
  for (let i = 0; i <= str.length; i++) {
    for (let j = i + 1; j <= str.length; j++) {
      res.push(str.slice(i, j));
    }
  }

  res = new Set(res);
  // console.log(res);
}
getAllString([1, 2, 3]);

/**
 *[1000, 2000, 3000]  每隔一段时间(item)打印相应的item
 */
function sequence(arr) {
  arr.reduce((acc, v) => {
    setTimeout(() => {
      console.log(v);
    }, acc);
    return acc + v;
  }, arr[0]);
}
// sequence([1000, 2000, 3000]);

/**
 * 数组的组合问题
 * [1,2,3] => [[1,2],[1,3],[2,3]]
 * [1,2,3] => [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
 */
function arrCombins(arr, num) {
  let res = [];
  const fn = (temp, _arr, range) => {
    console.log(`temp--${temp}`);
    console.log(`_arr--${_arr}`);
    if (temp.length === range) {
      res.push(temp);
    } else {
      for (let i = 0; i <= _arr.length - range + temp.length; i++) {
        console.log(_arr.length - range + temp.length);
        fn(temp.concat(_arr[i]), _arr.slice(i + 1), range);
      }
    }
  };
  if (!num) {
    const nums = Array.from(Array(arr.length + 1).keys()).slice(1);
    for (let n = 0; n <= nums.length; n++) {
      fn([], arr, nums[n]);
    }
  } else {
    fn([], arr, num);
  }

  console.log(res);
  return res;
}
// arrCombins([1, 2, 3], 2);
//arrCombins([1, 2, 3])

/**
 * 将数组扁平化并去除其中重复数据，最终得到一个升序且不重复的数组
 * handleArr([[1, 2, 2],[3, 4, 5, 5],[6, 7, 8, 9, [11, 12, [12, 13, [14]]]],10]);
 */

function handleArr(arr) {
  const flatArr = arr.flat(Infinity);
  const setArr = new Set(flatArr);
  const sortArr = Array.from(setArr).sort((a, b) => a - b);
  // Array.from(new Set(arr.flat(Infinity))).sort((a, b) => a - b);
  //
  //
  // const flatArr = arr => {
  //   return arr.reduce((acc, cur) => {
  //     const temp = Array.isArray(cur) ? flatArr(cur) : [cur];
  //     acc.push(...temp);
  //     return acc;
  //   }, []);
  // };
  // return Array.from(new Set(flatArr(arr))).sort((a, b) => a - b);
  return sortArr;
}
handleArr([
  [1, 2, 2],
  [3, 4, 5, 5],
  [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
  10
]);

/**
 * 随机生成一个长度为 10 的整数类型的数组
 * [2, 10, 3, 4, 8, 11, 10, 11, 20, 30] => [[2,3,4,8], [10,11], [20], [30]]
 */

function randomArray() {
  const length = 10,
    max = 100;
  let tempObj = {},
    reslut = [];
  const randomArr = Array.from({ length }, () => parseInt(Math.random() * max));
  const sortArr = Array.from(new Set(randomArr)).sort((a, b) => a - b);

  sortArr.map(val => {
    const restNum = Math.floor(val / 10);
    if (!tempObj[restNum]) tempObj[restNum] = [];
    tempObj[restNum].push(val);
  });
  // console.log(tempObj);
  for (let i in tempObj) {
    reslut.push(tempObj[i]);
  }
  console.log(reslut);
}
randomArray();
