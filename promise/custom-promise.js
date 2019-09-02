const isFunc = function(fn) {
  return Object.prototype.toSring.call(fn) === "[object Function]";
};
//promise 三种状态
const PENDING = "pending";
const RESOLVED = "fulfilled";
const REJECTED = "rejected";

// Promise的 状态不可逆
// let p =new Promise(function(resolve, reject) {
//   resolve('success')
//   resolve('success2')
//   reject('reject')
// })

// p.then(function(value) {
//   console.log(value) // success
// })

class CustomPromise {
  constructor(instance) {
    //判断传入实例的参数类型;
    if (!isFunc(instance)) console.error("参数必须为function类型");
    this.status = PENDING;
    this.value = null;
    this._resolve = this._resolve.bind(this);
    this._reject = this._reject.bind(this);

    // instance(this._resolve, this._reject);

    try {
      instance(this._resolve, this._reject);
    } catch (err) {
      this._reject(err);
    }
  }
  //对应 resolve 函数回调
  _resolve(data) {
    if (this.status != PENDING) return; //状态不可逆
    this.status = RESOLVED;
    this.value = data;
  }

  //对应 reject 函数回调
  _reject(err) {
    if (this.status != PENDING) return; //状态不可逆
    this.status = REJECTED;
    this.value = err;
  }

  //catch
  catch(err) {}

  //then
  then() {}

  //finally
  finally() {}

  //几个静态方法
  static resolve() {}

  static reject() {}

  static all() {}

  static race() {}
}
