//new 操作符
function customNew(func, ...args) {
  const obj = Object.create(null); //创建了一个空对象
  obj.__proto__ = func.prototype; //obj作为构造函数中的this，需要继承到func自身属性以及其原型
  const result = func.apply(obj, args);
  return result instanceof Object ? result : obj; //如果有return 对象的话，调用并返回该对象; return 非对象的话，忽略
}

//call实现
Function.prototype.myCall = function(context) {
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
  Array.from(new Set(arr.flat(Infinity))).sort((a, b) => a - b);
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

  // while (arr.some(Array.isArray)) {
  //   arr = [].concat(...arr);
  // }
  // console.log(arr);
  return sortArr;
}
// handleArr([
//   [1, 2, 2],
//   [3, 4, 5, 5],
//   [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
//   10
// ]);
/**
 * 迭代方式实现flatten
 */
function iteratorFlatten(arr) {
  let result = [];
  while (arr.length) {
    const value = arr.shift();
    console.log(arr);
    if (Array.isArray(value)) {
      arr.unshift(...value);
    } else {
      result.push(value);
    }
  }
  return result;
}
/**
 * 递归方式实现flatten
 */
function recursiveFlatten(arr, result = []) {
  for (let i = 0; i < arr.length; i++) {
    Array.isArray(arr[i])
      ? recursiveFlatten(arr[i], result)
      : result.push(arr[i]);
  }
  return result;
}

// console.log(
//   recursiveFlatten([
//     [1, 2, 2],
//     [3, 4, 5, 5],
//     [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
//     10
//   ])
// );
/**
 * 随机生成一个长度为 10 的整数类型的数组
 * [2, 10, 3, 4, 8, 11, 10, 11, 20, 30] => [[2,3,4,8], [10,11], [20], [30]]
 */

function randomArray() {
  const length = 10,
    max = 100;
  let tempObj = {}, //对象作为hash列表
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
  // console.log(reslut);
}
randomArray();

/**
 * 多个数组的交集
 * ([1,2,3,4], [2,3,3,4], [3,4,5]) => [3]
 */
function intersectionArr(...args) {
  // let min_arr = arguments[0],
  //   intersect = [];
  // //先遍历出数组长度最小的元组，使后面的第一层循环次数最少
  // for (let i = 0; i < arguments.length; i++) {
  //   if (min_arr.length > arguments[i].length) {
  //     min_arr = arguments[i];
  //   }
  // }
  // for (let i = 0; i < min_arr.length; i++) {
  //   let flag = true;
  //   for (let j = 0; j < arguments.length; j++) {
  //     if (!arguments[j].includes(min_arr[i])) {
  //       flag = false;
  //       break;
  //     }
  //   }
  //   if (flag) {
  //     if (!intersect.includes(min_arr[i])) {
  //       intersect.push(min_arr[i]);
  //     }
  //   }
  // }
  // console.log(intersect);
  // return intersect;

  const result = args.reduce((acc, item) => {
    // console.log(acc);
    return acc.filter(val => item.includes(val));
  });
  // console.log(result);
  return result;
}
intersectionArr([1, 2, 3, 4], [2, 3], [3, 4, 5]);

/**
 * 简单实现数组map方法
 */
Array.prototype.myMap = function(fn, context = this) {
  // console.log(context);
  const arr = this;
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn.call(context, arr[i], i, arr));
  }
  return result;
};
// console.log([1, 2, 3].myMap(item => item * 2, [2, 3, 4]));

/**
 * 简单实现数组reduce方法
 * accumulator,curValue, curIndex, arr
 */
Array.prototype.myReduce = function(fn, initialValue) {
  const arr = this;
  let acc = initialValue === undefined ? arr[0] : initialValue;
  // const startIndex = initialValue === undefined ? 0 : 1;
  // console.log(initialValue === undefined);
  for (let i = 0; i < arr.length; i++) {
    acc = fn(acc, arr[i], i, arr);
  }
  return acc;
};
// console.log(
//   [1, 2, 3].myReduce((acc, item) => {
//     acc += item;
//     return acc;
//   }, 0)
// );
// var initialValue = 2;
// var sum = [{ x: 1 }, { x: 2 }, { x: 3 }].myReduce(function(
//   accumulator,
//   currentValue
// ) {
//   console.log(currentValue);
//   return accumulator + currentValue.x;
// },
// 2);

// console.log(sum); // logs 6

/**
 * 简单实现数组filter方法
 */
Array.prototype.myFilter = function(fn, context = this) {
  const arr = this;
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    fn.call(context, arr[i], i, arr) && result.push(arr[i]);
  }
  return result;
};
// console.log([1, 2, 3, 4].myFilter(item => item >= 3));

/**
 * 简单实现数组indexOf方法
 */
Array.prototype.myIndexOf = function(searchElement, startIndex = 0) {
  const arr = this,
    len = arr.length;
  if (startIndex > len) return -1;
  if (startIndex < 0) startIndex = len - Math.abs(startIndex); //开始索引为负数，从倒数相应的位置开始检索
  for (let i = startIndex; i < arr.length; i++) {
    if (arr[i] === searchElement) return i;
  }
  return -1;
};
//找出指定元素出现的所有位置  【1,2,2,3,4,5,2,5,2]
function findAllIndex(arr, element) {
  let result = [];
  let index = arr.indexOf(element);
  while (index != -1) {
    result.push(index);
    index = arr.indexOf(element, index + 1);
  }
  return result;
}
// console.log(findAllIndex([1, 2, 2, 3, 4, 5, 2, 5, 2], 2));

/**
 * 简单实现数组some方法  有一个回调返回true，函数就返回true
 */
Array.prototype.mySome = function(fn, context = this) {
  const arr = this;
  if (arr.length === 0) return false; //空数组返回false
  for (let i = 0; i < arr.length; i++) {
    if (fn.call(context, arr[i], i, arr)) return true;
  }
  return false;
};
// console.log([1, 2, 3].mySome(item => item === 4));

/**
 * 简单实现数组every方法   所有回调返回true，函数就返回true
 */
Array.prototype.myEvery = function(fn, context = this) {
  const arr = this;
  if (arr.length === 0) return true; //空数组返回true
  for (let i = 0; i < arr.length; i++) {
    if (!fn.call(context, arr[i], i, arr)) return false;
  }
  return true;
};
// console.log([1, 2, 3].myEvery(item => item < 2));

/**
 * 简单实现数组splice方法
 * arr.splice(startIndex, count) 从startIndex索引开始，删除count个元素
 * arr.splice(startIndex, 0, ele1,ele2...) 在arr原startIndex索引位置，插入传入的参数元素
 * arr.splice(startIndex, count, ele1,ele2...) 从startIndex索引开始，删除count个元素, 再插入传入的参数元素
 */
let arr = [1, 2, 3, 4];
// console.log(arr.splice(1, 1, 6, 7));

Array.prototype.mySplice = function(startIndex, deleteCount, ...newElements) {
  const arr = this;
  let len = arr.length,
    deleteArr = [];
  const restLen = len - startIndex;

  //处理startIndex边界
  if (startIndex < 0) {
    startIndex = startIndex + len > 0 ? startIndex + len : 0; //负数从 startIndex + len 索引开始，Math.abs(startIndex)大于len的话，从0索引开始
  } else {
    startIndex = startIndex > len ? len : startIndex; //startIndex大于len，从len索引开始
  }

  //处理deleteCount需要删除长度边界
  if (arguments.length === 1 || deleteCount > restLen) deleteCount = restLen; //deleteCount不传，或者值大于startIndex后的所有元素长度
  if (deleteCount <= 0) deleteCount = 0; //deleteCount<=0，不删除元素

  //处理删除元素
  for (let i = 0; i < deleteCount; i++) {
    const index = startIndex + i;
    // if (arr.indexOf(arr[index]) === index) {
    //   deleteArr.push(arr[index]);
    // }
    if (index in arr) deleteArr.push(arr[index]);
  }

  //删除移动元素后多余的元素
  if (deleteCount < newElements.length) {
    // 删除的元素比新增的元素少，那么后面的元素整体向后挪动
    for (let i = len - 1; i >= startIndex + deleteCount; i--) {
      const moveToIndex = i + newElements.length - deleteCount;
      arr[moveToIndex] = arr[i];
      // i in arr ? (arr[moveToIndex] = arr[i]) : delete arr[i];
    }
  } else {
    // 删除的元素比新增的元素多，那么后面的元素整体向前挪动
    for (let i = startIndex + deleteCount; i <= len; i++) {
      const moveToIndex = i - (deleteCount - newElements.length);
      arr[moveToIndex] = arr[i];
      // i in array ? (array[moveToIndex] = array[i]) : delete array[toIndex];
    }
  }

  //插入需要添加的元素
  for (let i = 0; i < newElements.length; i++) {
    arr[startIndex + i] = newElements[i];
  }
  arr.length = len - deleteArr.length + newElements.length;
  console.log(arr, "arr");
  return deleteArr;
};
// console.log([1, 2, 3, 4, 9, 0].mySplice(2, 0));
// console.log([1, 2, 3, 4, 9, 0].mySplice(2, 1));
// console.log([1, 2, 3, 4, 9, 0].mySplice(2, 2, 5, 6, 7));
// console.log([1, 2, 3, 4, 9, 0].mySplice(2, 5, 5, 6, 7));

/**
 * 简易版浅拷贝
 * Object.assign, [].concat(), [].slice(), [...arr]扩展符
 */
function shallowClone(obj) {
  const isObject = obj =>
    Object.prototype.toString.call(obj) === "[object Object]";
  if (!isObject(obj)) return obj;
  let target = {};
  if (Array.isArray(obj)) {
    target = obj.slice();
  } else {
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        target[i] = obj[i];
      }
    }
  }
  return target;
}
/**
 * 简易版深拷贝
 */
function deepClone(obj) {
  const isObject = obj =>
    Object.prototype.toString.call(obj) === "[object Object]";
  if (!isObject(obj)) return obj;
  let target = {};
  if (Array.isArray(obj)) {
    target = obj.slice();
  } else {
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        isObject(obj[i])
          ? (target[i] = deepClone(obj[i]))
          : (target[i] = obj[i]);
      }
    }
  }
  return target;
}
// const a = { aaa: 1, bbb: { q: { d: 9 } } };
// const b = deepClone(a);
// b.bbb.q.d = 4;
// console.log(a);
// console.log(b);

/**
 * 精确倒计时
 */
function execSetTimeout(cb, time) {
  const start = Date.now();
  let stop = 0;
  while (true) {
    stop = Date.now();
    if (stop - start === time) {
      cb();
      break;
    }
  }
}
/**
 * 实现sleep方法
 */
//promise
function sleep(time) {
  // return new Promise(resolve => setTimeout(resolve, time));
  return new Promise(resolve => execSetTimeout(resolve, time));
}
//async/await
async function asyncSleep(time) {
  const wait = await sleep(time);
  console.log(1);
}
//genetator
function* genetatorSleep(time) {
  yield new Promise(resolve => setTimeout(resolve, time));
}
// console.log(
//   genetatorSleep(1000)
//     .next()
//     .value.then(() => {
//       console.log(1);
//     })
// );
// sleep(1000).then(() => {
//   console.log(111);
// });

/**
 * (5).add(2).minus(3)
 * 边界：浮点数的问题  0.2+0.1 = 0.30000000000000004，
 * Number.MAX_SAFE_INTEGER num的安全极值
 */
Number.MAX_SAFE_DIGITS = Number.MAX_SAFE_INTEGER.toString().length - 2;
Number.prototype.digits = function() {
  let result = (
    this.valueOf()
      .toString()
      .split(".")[1] || ""
  ).length;
  return result > Number.MAX_SAFE_DIGITS ? Number.MAX_SAFE_DIGITS : result;
};
Number.prototype.add = function(i = 0) {
  if (typeof i !== "number") {
    throw new Error("请输入正确的数字");
  }
  const v = this.valueOf();
  const thisDigits = this.digits();
  const iDigits = i.digits();
  const baseNum = Math.pow(10, Math.max(thisDigits, iDigits));
  const result = (v * baseNum + i * baseNum) / baseNum;
  if (result > 0) {
    return result > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : result;
  } else {
    return result < Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : result;
  }
};
Number.prototype.minus = function(i = 0) {
  if (typeof i !== "number") {
    throw new Error("请输入正确的数字");
  }
  const v = this.valueOf();
  const thisDigits = this.digits();
  const iDigits = i.digits();
  const baseNum = Math.pow(10, Math.max(thisDigits, iDigits));
  const result = (v * baseNum - i * baseNum) / baseNum;
  if (result > 0) {
    return result > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : result;
  } else {
    return result < Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : result;
  }
};

/**
 * {1:222, 2:123, 5:888}，请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null]。
 */
function changeArr(obj) {
  const arr = Array.from({ length: 12 }, v => null);
  Object.keys(obj).forEach(key => {
    arr[key - 1] = obj[key];
  });
  return arr;
}
// console.log(changeArr({ 1: 222, 2: 123, 5: 888 }));

/** 
 * 重点是 队列的构造，如何进行先进先出
    LazyMan('Tony');
    // Hi I am Tony

    LazyMan('Tony').sleep(10).eat('lunch');
    // Hi I am Tony
    // 等待了10秒...
    // I am eating lunch

    LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
    // Hi I am Tony
    // I am eating lunch
    // 等待了10秒...
    // I am eating diner

    LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
    // Hi I am Tony
    // 等待了5秒...
    // I am eating lunch
    // I am eating dinner
    // 等待了10秒...
    // I am eating junk food
*/

class Lazy {
  constructor(name) {
    this.queue = [];
    console.log(`Hi I am ${name}`);
    this.init.bind(this);
  }
  init() {
    const item = new Promise(resolve => {
      resolve();
    }).then(() => {
      this.run();
    });
  }
  sleep(timer) {
    const item = () => {
      setTimeout(() => {
        console.log(`等待了${timer}秒...`);
        this.run();
      }, timer * 1000);
    };
    this.queue.push(item);
    // console.log(this.queue);
    return this;
  }
  sleepFirst(timer) {
    const item = () => {
      setTimeout(() => {
        console.log(`等待了${timer}秒...`);
        this.run();
      }, timer * 1000);
    };
    this.queue.unshift(item);
    return this;
  }
  eat(name) {
    const item = () => {
      console.log(`Hi I am ${name}`);
      this.run();
    };
    this.queue.push(item);
    return this;
  }
  run() {
    const firstQueueFn = this.queue.shift();
    firstQueueFn && firstQueueFn();
  }
}
//下面算法是将执行队列的方法抽离了出来，与队列的进出进行了解耦
class LazyMan1 {
  constructor(name) {
    this.name = name;
    this.queue = [];
    console.log(`Hi I am ${name}`);

    setTimeout(this.apply.bind(this));
  }

  eat(something) {
    this.queue.push(() => console.log(`I am eating ${something}`));
    return this;
  }

  sleep(time) {
    this.queue.push(async () => {
      console.log(`等待了${time}秒...`);
      return new Promise(res => setTimeout(res, time * 1000));
    });
    return this;
  }

  sleepFirst(time) {
    this.queue.unshift(async () => {
      console.log(`等待了${time}秒...`);
      return new Promise(res => setTimeout(res, time * 1000));
    });
    return this;
  }

  async apply() {
    const queue = this.queue;
    while (queue.length) {
      const todo = queue.shift();
      await todo();
    }
  }
}
function LazyMan(name) {
  return new Lazy(name);
}
// LazyMan("Tony");

// LazyMan("Tony")
//   .sleep(10)
//   .eat("lunch");

// LazyMan("Tony")
//   .eat("lunch")
//   .sleep(10)
//   .eat("dinner");

// LazyMan("Tony")
//   .eat("lunch")
//   .eat("dinner")
//   .sleepFirst(5)
//   .sleep(10)
//   .eat("junk food");

/**
 * 冒泡排序
 */
function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (arr[i] > arr[j]) {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}

/**
 * 快速排序, 找到基准值，分左右两部分，依次递归循环
 */
console.time("test");
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const baseIndex = Math.floor(arr.length / 2);
  const base = arr.splice(baseIndex, 1)[0];
  // console.log(base);
  let left = [],
    right = [];
  for (let i = 0; i < arr.length; i++) {
    arr[i] < base ? left.push(arr[i]) : right.push(arr[i]);
  }
  return [...quickSort(left), base, ...quickSort(right)];
}
console.log(quickSort([2, 5, 3, 6, 88, 22, 11, 11, 11, 11, 30, 50, 44]));
console.timeEnd("test");

/**
 * 快速排序 优化版，分成了三组，left,center,right,处理相同元素性能上会比较快
 */
console.time("test1");
function optimizeQuickSort(arr) {
  //三路快排
  if (arr.length == 0) return arr;
  let left = [],
    center = [],
    right = [];
  const baseIndex = Math.floor(arr.length / 2);
  const base = arr[baseIndex];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < base) {
      left.push(arr[i]);
    } else if (arr[i] == base) {
      center.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...optimizeQuickSort(left), ...center, ...optimizeQuickSort(right)];
}
console.log(
  optimizeQuickSort([2, 5, 3, 6, 88, 22, 11, 11, 11, 11, 30, 50, 44])
);
console.timeEnd("test1");

/**
 * 快速排序，双指针方法
 */
//元素交换
function swap(A, i, j) {
  const t = A[i];
  A[i] = A[j];
  A[j] = t;
}
/**
 *
 * @param {*} A  数组
 * @param {*} p  起始下标
 * @param {*} r  结束下标 + 1
 */
function divide(A, p, r) {
  const x = A[r - 1];
  let i = p - 1;

  for (let j = p; j < r - 1; j++) {
    if (A[j] <= x) {
      i++;
      swap(A, i, j);
    }
  }

  swap(A, i + 1, r - 1);

  return i + 1;
}
/**
 *
 * @param {*} A  数组
 * @param {*} p  起始下标
 * @param {*} r  结束下标 + 1
 */
function qsort(A, p = 0, r) {
  r = r || A.length;

  if (p < r - 1) {
    const q = divide(A, p, r);
    qsort(A, p, q);
    qsort(A, q + 1, r);
  }

  return A;
}
