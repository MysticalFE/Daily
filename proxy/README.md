### vue3 Proxy与Object.defineProperty的区别
---
#### Object.defineProperty的缺陷
1. `Object.defineProperty`直接给数组下标赋值的话，在数据属性比较多的话，性能消耗和用户体验不成正比，只能通过`vue`内部改写的`push`，`splice`, `shift`...来监控数组数据变化
2. `Object.defineProperty`只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历。在`vue`里，是通过递归以及遍历`data `对象来实现对数据的监控的，如果属性值也是对象那么需要深度遍历

#### Proxy的优势和缺陷
1. 优势可以解决上面两个问题，监控对数组下标赋值以及整个对象数据改变
2. 缺陷是没有对应的`polyfill`来向下优雅的兼容处理

