# LRU缓存机制

> 运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制。它应该支持以下操作： 获取数据 get 和 写入数据 put 。
>获取数据 get(key) - 如果密钥 (key) 存在于缓存中，则获取密钥的值（总是正数），否则返回 -1。
>写入数据 put(key, value) - 如果密钥已经存在，则变更其数据值；如果密钥不存在，则插入该组「密钥/数据值」。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间

示例：

```typescript
LRUCache cache = new LRUCache( 2 /* 缓存容量 */ );

cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // 返回  1
cache.put(3, 3);    // 该操作会使得密钥 2 作废
cache.get(2);       // 返回 -1 (未找到)
cache.put(4, 4);    // 该操作会使得密钥 1 作废
cache.get(1);       // 返回 -1 (未找到)
cache.get(3);       // 返回  3
cache.get(4);       // 返回  4
```

Map数据结构实现：

```typescript
const LRUCache = function(this: any, capacity: number) {
    this.map = new Map();
    this.size = capacity;
};

LRUCache.prototype.get = function(key: number): number {
    const value = this.map.get(key) || -1;
    if(value !== -1) {
        this.map.delete(key);
        this.map.set(key, value);
    }
    return value;
};

LRUCache.prototype.put = function(key: number, value: number): void {
    if(this.map.has(key)) {
        this.map.delete(key);
    }
    this.map.set(key, value);
    if(this.map.size > this.size) {
        this.map.delete(this.map.keys().next().value)
    }
};
```
