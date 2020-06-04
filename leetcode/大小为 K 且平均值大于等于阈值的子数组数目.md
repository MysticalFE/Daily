# 大小为 K 且平均值大于等于阈值的子数组数目

>给你一个整数数组 arr 和两个整数 k 和 threshold 。请你返回长度为 k 且平均值大于等于 threshold 的子数组数目。

示例:

```js
输入：arr = [2,2,2,2,5,5,5,8], k = 3, threshold = 4
输出：3
解释：子数组 [2,5,5],[5,5,5] 和 [5,5,8] 的平均值分别为 4，5 和 6 。其他长度为 3 的子数组的平均值都小于 4 （threshold 的值)。

输入：arr = [1,1,1,1,1], k = 1, threshold = 0
输出：5

输入：arr = [11,13,17,23,29,31,7,5,2,3], k = 3, threshold = 5
输出：6
解释：前 6 个长度为 3 的子数组平均值都大于 5 。注意平均值不是整数。

输入：arr = [7,7,7,7,7,7,7], k = 7, threshold = 7
输出：1

输入：arr = [4,4,4,4], k = 4, threshold = 1
输出：1
```

算法（采用滑动窗口）

```js
const numOfSubarrays = function(arr, k, threshold) {
  let accCount = 0,
    len = arr.length,
    sum = 0,
    target = threshold === 0 ? 0 : k * threshold;
  
  for (let i = 0; i < k; i++) sum += arr[i]; //此时sum为第一次前k位索引的元素和
  if (sum >= target) accCount++;
  for(let i = k; i < len; i++) {
      sum -= arr[i-k];
      sum += arr[i];
      if(sum >= target) accCount++;
  }
  return accCount;
};
```