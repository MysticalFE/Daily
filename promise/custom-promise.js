(function(root) {
  const isFunc = function(fn) {
    return Object.prototype.toString.call(fn) === "[object Function]";
  };
  //promise 三种状态
  const PENDING = "pending";
  const RESOLVED = "fulfilled";
  const REJECTED = "rejected";

  // Promise的 状态不可逆, Promise构造函数内是同步执行，then，catch是异步执行
  // let p =new Promise(function(resolve, reject) {
  //   console.log(12123234)
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
    //当p2resolve方法传入一个Promise对象，那么p2当前状态由p1状态来决定，所以需要判断下传入的value类型
    _resolve(value) {
      if (this.status != PENDING) return; //状态不可逆
      setTimeout(() => {
        let cb = null;
        //循环处理经then链式调用的resolve队列
        const handle = (...args) => {
          // console.log(args);
          let cb = null,
            val;
          while ((cb = args[1].shift())) {
            //当resolve传入的参数类型为function时，resolve(() => void) 需要将该参数调用返回值；
            val = isFunc(args[0]) ? args[0].call(this) : args[0];
            cb(val);
          }
        };

        //判断传入的是否CustomPromise对象
        if (value instanceof CustomPromise) {
          value.then(
            value => {
              this.status = RESOLVED;
              this.value = value;
              handle(value, this.resolveQueues);
            },
            err => {
              this.status = REJECTED;
              this.value = err;
              handle(err, this.rejectQueues);
            }
          );
        } else {
          this.status = RESOLVED;
          this.value = value;
          handle(value, this.resolveQueues);
        }
      }, 0);
    }

    //对应 reject 函数回调
    _reject(err) {
      setTimeout(() => {
        if (this.status != PENDING) return; //状态不可逆
        this.status = REJECTED;
        this.value = err;
        let cb = null;
        //循环处理失败队列回调
        while ((cb = this.rejectQueues.shift())) {
          cb(err);
        }
      }, 0);
    }

    //catch
    catch(rejectFn) {
      return this.then(undefined, rejectFn);
    }

    //then
    then(onResolved, onRejected) {
      const { status, value } = this;
      //链式调用，then方法返回当前 CustomPromise 实例对象
      return new CustomPromise((onResolvedNext, onRejectedNext) => {
        const resolved = value => {
          //判断当前返回的resolved参数是常值，还是return出来的函数
          if (!isFunc(onResolved)) {
            onResolvedNext(value);
          } else {
            const result = onResolved(value);
            //如果result返回的是一个CustomPromise实例对象，要等其状态改变后在执行下一个回调
            //否则直接传入到下一个then回调，并马上执行
            result instanceof CustomPromise
              ? result.then(onResolvedNext, onRejectedNext)
              : onResolvedNext(result);
          }
        };
        const rejected = err => {
          //判断当前返回的resolved参数是常值，还是return出来的函数
          if (!isFunc(onRejected)) {
            onRejectedNext(err);
          } else {
            const result = onRejected(err);
            //如果result返回的是一个CustomPromise实例对象，要等其状态改变后在执行下一个回调
            //否则直接传入到下一个then回调，并马上执行
            result instanceof CustomPromise
              ? result.then(onResolvedNext, onRejectedNext)
              : onRejectedNext(result);
          }
        };
        switch (status) {
          case PENDING:
            this.resolveQueues.push(resolved);
            this.rejectQueues.push(rejected);
            break;
          case RESOLVED:
            resolved(value);
            break;
          case REJECTED:
            rejected(value);
            break;
        }
      });
    }

    //finally
    //不管成功与否 都执行then方法
    finally(fn) {
      return this.then(
        value => CustomPromise.resolve(fn()).then(() => value),
        reason =>
          CustomPromise.resolve(fn()).then(() => {
            throw reason;
          })
      );
    }

    //几个静态方法
    //new 一个新的 CustomPromise 实例并调用 resolve 方法，最后返回。
    static resolve(value) {
      if (value instanceof CustomPromise) return value;
      return new CustomPromise(resolve => resolve(value));
    }
    //同 resolve
    static reject(value) {
      if (value instanceof CustomPromise) return value;
      return new CustomPromise((resolve, reject) => reject(value));
    }

    //Promise.all
    //CustomPromise.all([p1,p2,p3...]) || CustomPromise.all(p1,p2,p3...)
    static all() {
      const args = Array.from(
        arguments.length === 1 && Array.isArray(arguments[0])
          ? arguments[0]
          : arguments
      );
      return new CustomPromise((resolve, reject) => {
        let count = 0,
          result = [];
        for (let i = 0; i < args.length; i++) {
          this.resolve(args[i])
            .then(value => {
              count++;
              result[i] = value;
              if (count === args.length) resolve(result);
            })
            .catch(err => {
              reject(err);
            });
        }
      });
    }

    //Promise.race
    //CustomPromise队列中优先resolve的就结束
    static race() {
      const args = Array.from(
        arguments.length === 1 && Array.isArray(arguments[0])
          ? arguments[0]
          : arguments
      );

      return new CustomPromise((resolve, reject) => {
        args.forEach(item => {
          this.resolve(item)
            .then(value => {
              resolve(value);
            })
            .catch(err => {
              reject(err);
            });
        });
      });
    }

    //Promise.try
    static try(cb) {
      return new CustomPromise((resolve, reject) => {
        resolve(cb());
      });
    }
  }
  root.CustomPromise = CustomPromise;
})(globalThis || window);
