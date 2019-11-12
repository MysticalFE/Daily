白屏时间 --- 浏览器从响应用户输入网址地址，到浏览器开始显示内容的时间。
首屏时间 --- 浏览器从响应用户输入网络地址，到首屏内容渲染完成的时间。
利用 ``` performance ```对象观察监控性能指标
#### ``` performance.timing ```

> navigationStart: 表示从上一个文档卸载结束时的 unix 时间戳，如果没有上一个文档，这个值将和 fetchStart 相等。
unloadEventStart: 表示前一个网页（与当前页面同域）unload 的时间戳，如果无前一个网页 unload 或者前一个网页与当前页面不同域，则值为 0。
unloadEventEnd: 返回前一个页面 unload 时间绑定的回掉函数执行完毕的时间戳。
redirectStart: 第一个 HTTP 重定向发生时的时间。有跳转且是同域名内的重定向才算，否则值为 0。
redirectEnd: 最后一个 HTTP 重定向完成时的时间。有跳转且是同域名内部的重定向才算，否则值为 0。
fetchStart: 浏览器准备好使用 HTTP 请求抓取文档的时间，这发生在检查本地缓存之前。
domainLookupStart/domainLookupEnd: DNS 域名查询开始/结束的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
connectStart: HTTP（TCP）开始/重新 建立连接的时间，如果是持久连接，则与 fetchStart 值相等。
connectEnd: HTTP（TCP） 完成建立连接的时间（完成握手），如果是持久连接，则与 fetchStart 值相等。
secureConnectionStart: HTTPS 连接开始的时间，如果不是安全连接，则值为 0。
requestStart: HTTP 请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存。
responseStart: HTTP 开始接收响应的时间（获取到第一个字节），包括从本地读取缓存。
responseEnd: HTTP 响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存。
domLoading: 开始解析渲染 DOM 树的时间，此时 Document.readyState 变为 loading，并将抛出 readystatechange 相关事件。
domInteractive: 完成解析 DOM 树的时间，Document.readyState 变为 interactive，并将抛出 readystatechange 相关事件，注意只是 DOM 树解析完成，这时候并没有开始加载网页内的资源。
domContentLoadedEventStart: DOM 解析完成后，网页内资源加载开始的时间，在 DOMContentLoaded 事件抛出前发生。
domContentLoadedEventEnd: DOM 解析完成后，网页内资源加载完成的时间（如 JS 脚本加载执行完毕）。
domComplete: DOM 树解析完成，且资源也准备就绪的时间，Document.readyState 变为 complete，并将抛出 readystatechange 相关事件。
loadEventStart: load 事件发送给文档，也即 load 回调函数开始执行的时间。
loadEventEnd: load 事件的回调函数执行完毕的时间。

相关加载时间
```
function getPerformanceTiming() {
  const t = performance.timing
  let times = {}
  // 页面加载完成的时间，用户等待页面可用的时间
  times.loadPage = t.loadEventEnd - t.navigationStart
  // 解析 DOM 树结构的时间
  times.domReady = t.domComplete - t.responseEnd
  // 重定向的时间
  times.redirect = t.redirectEnd - t.redirectStart
  // DNS 查询时间
  times.lookupDomain = t.domainLookupEnd - t.domainLookupStart
  // 读取页面第一个字节的时间
  times.ttfb = t.responseStart - t.navigationStart
  // 资源请求加载完成的时间
  times.request = t.responseEnd - t.requestStart
  // 执行 onload 回调函数的时间
  times.loadEvent = t.loadEventEnd - t.loadEventStart
  // DNS 缓存时间
  times.appcache = t.domainLookupStart - t.fetchStart
  // 卸载页面的时间
  times.unloadEvent = t.unloadEventEnd - t.unloadEventStart
  // TCP 建立连接完成握手的时间
  times.connect = t.connectEnd - t.connectStart
  return times
}

```

#### ```performance.navigation```
>redirectCount: 0 // 页面经过了多少次重定向
type: 0
0 表示正常进入页面；
1 表示通过 window.location.reload() 刷新页面；
2 表示通过浏览器前进后退进入页面；
255 表示其它方式

#### ```performance.memory```
>jsHeapSizeLimit: 内存大小限制
totalJSHeapSize: 可使用的内存
usedJSHeapSize: JS 对象占用的内存
