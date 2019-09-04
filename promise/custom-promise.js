const isFunc = function(fn) {
  return Object.prototype.toString.call(fn) === "[object Function]";
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

//resolve()返回的是 Promise对象
// new Promise((resolve,reject) => {console.log(resolve() instanceof Promise)})

class CustomPromise {
  constructor(instance) {
    // console.log(instance);
    //判断传入实例的参数类型;
    if (!isFunc(instance)) {
      throw new Error("参数必须为function类型");
      return;
    }
    this.status = PENDING;
    this.value = null;
    this.resolveQueues = []; //成功回调队列
    this.rejectQueues = []; //失败回调队列
    // this._resolve = this._resolve.bind(this);
    // this._reject = this._reject.bind(this);

    // instance(this._resolve, this._reject);

    try {
      instance(this._resolve.bind(this), this._reject.bind(this));
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
  then(onResolved, onRejected) {
    const { status, value } = this;
    switch (status) {
      case PENDING:
        this.resolveQueues.push(onResolved);
        this.rejectQueues.push(onRejected);
        break;
      case RESOLVED:
        onResolved(value);
        break;
      case REJECTED:
        onRejected(value);
        break;
    }

    return new CustomPromise((onResolved, onRejected) => {});
  }

  //finally
  finally() {}

  //几个静态方法
  static resolve() {}

  static reject() {}

  static all() {}

  static race() {}
}
