class LRUCache {
  length: number;
  data: Map<any, any>;
  constructor(length: number) {
    this.length = length;
    this.data = new Map();
  }
  // 存储数据，通过键值对的方式
  set(key: any, value: any) {
    const data = this.data;
    if (data.has(key)) {
      data.delete(key);
    }
    data.set(key, value);

    // 如果超出了容量，则需要删除最久的数据
    if (data.size > this.length) {
      const delKey = data.keys().next().value;
      data.delete(delKey);
    }
  }
  // 获取数据
  get(key: any) {
    const data = this.data;
    // 未找到
    if (!data.has(key)) {
      return null;
    }
    const value = data.get(key); // 获取元素
    data.delete(key); // 删除元素
    data.set(key, value); // 重新插入元素
  }
}
