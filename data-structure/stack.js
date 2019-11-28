/**
 * 栈，后进先出
 * 栈顶始终指向最后一个元素，并随着push操作栈顶位置向后移动位置
 * 当栈满时，会出现overflow溢出错误
 */
class Stack {
  constructor() {
    this.list = new Array(max);
    this.top = -1; //栈顶位置
  }
  //栈中添加元素
  push(el) {
    if (this.top === this.list.length - 1) {
      throw "overflow";
    }
    this.top++;
    this.list.push(el);
  }
  //从栈顶移除元素，返回移除元素
  pop() {
    this.top--;
    return this.list.pop();
  }
  //栈是否为空
  isEmpty() {
    return this.list.length === 0;
  }
  //清空栈
  remove() {
    this.list.length = 0;
  }
  //返回栈长度
  length() {
    return this.list.length;
  }
  //查找返回栈顶元素，不修改原栈
  findTopEle() {
    return this.list[this.list.length - 1];
  }
}
