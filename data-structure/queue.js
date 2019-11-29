/**
 * 队列 先进先出，在尾部添加新元素，并从顶部移除元素。最新添加的元素排在队列的末尾
 * push ，shift
 * 传入了 @param priority, 顺序队列转变为优先队列，priority越大优先级越高，优先级高的元素在优先级稍低的后面
 */
class Queue {
  constructor() {
    this.list = [];
  }
  enqueue(item, priority = 0) {
    this.list.push(item);
  }
  dequeue() {
    return this.list.shift();
  }
  front() {
    return this.list[0];
  }
  back() {
    return this.list[this.list.length - 1];
  }
  empty() {
    return this.list.length === 0;
  }
  length() {
    return this.list.length;
  }
}

//基数排序

var queues = []; //定义队列数组
var nums = []; //定义数字数组

//选十个0~99的随机数进行排序
for (var i = 0; i < 10; i++) {
  queues[i] = new Queue();
  nums[i] = Math.floor(Math.random() * 101);
}

//排序之前
console.log("before radix sort: " + nums);

//基数排序
distribution(nums, queues, 10, 1);
collect(queues, nums);
distribution(nums, queues, 10, 10);
collect(queues, nums);

//排序之后
console.info("after radix sort: " + nums);
//根据相应的（个位和十位）数值，将数字分配到相应队列

function distribution(nums, queues, n, digit) {
  //digit表示个位或者十位的值
  for (var i = 0; i < n; i++) {
    if (digit == 1) {
      queues[nums[i] % 10].enqueue(nums[i]);
    } else {
      queues[Math.floor(nums[i] / 10)].enqueue(nums[i]);
    }
  }
  console.log(queues);
}

//从队列中收集数字

function collect(queues, nums) {
  var i = 0;
  for (var digit = 0; digit < 10; digit++) {
    while (!queues[digit].empty()) {
      nums[i++] = queues[digit].front();
      queues[digit].dequeue();
    }
  }
  console.log(nums);
}

/**
 * 循环队列,
 * 相当于将队首和队尾连接起来(并不是真正的串联起来)，删除队首元素，将删除的队首元素添加到队尾，直到指定某个循环结束，删除队首元素，接着循环依次
 */

function loopQueue(nameList, num = 0) {
  const queue = new Queue();
  num = num ? num : Math.random() * 10; //队列需要循环的次数
  for (let i = 0; i < nameList.length; i++) {
    queue.enqueue(nameList[i]);
  }
  //循环队列
  while (queue.length() > 1) {
    for (let i = 0; i < num; i++) {
      queue.enqueue(queue.dequeue());
      console.log(queue.list);
    }

    queue.dequeue();
  }

  return queue.dequeue(); //最后返回队首元素
}
const nums = [1, 2, 3, 4, 5, 6];
const result = loopQueue(nums);
console.log(result);
