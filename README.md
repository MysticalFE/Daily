#### `__proto__`和`prototype`

- [传送门 1-图示](https://www.processon.com/view/link/5cd95a72e4b00528647f6cd5)

- [传送门 2](https://github.com/creeperyang/blog/issues/9)

- [MDN 关于继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

#### 函数节流 `throttle` 与 函数防抖 `debounce`

`节流throttle`是在一定时间间隔内控制函数调用频率
`防抖debounce`是在一定时间间隔内函数只被调用一次
连续事件或与控制频率相关可以考虑使用两者

`节流throttle`一般用在:

- DOM 元素拖拽, `mousemove`事件
- 计算鼠标移动距离 `mousemove`事件
- 射击游戏子弹发射频率
- 联想搜索 `keyup`事件

`防抖debounce`一般用在:

- `window`的`resize`事件
- 文本输入验证等连续输入行为需要输入完毕后请求

**_对于 scroll 事件，执行`throttle`事件，页面滚动就会在时间间隔内执行一次回调处理函数；执行`debounce`，只有在页面滚动完毕后才会执行回调处理函数_**
