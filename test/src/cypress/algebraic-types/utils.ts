/* eslint-disable @typescript-eslint/ban-types */
export function curry(func: Function) {
  // @ts-ignore
  return function curried(...args: any) {
    if (args.length >= func.length) {
      return func.apply(null, args);
    } else {
      return curried.bind(null, ...args);
    }
  };
}

const __ = Symbol('Function arg placeholder');
//curried function to select a property of an object.
// @ts-ignore
const prop = (prop: string | symbol, object?: Object): ((any) => any) => {
  const errMsg = "Make sure usage was like one of: prop('a',{a:1}),prop(prop.__,{a:1})('a'), prop('a')({a:1})";
  if (typeof prop !== 'symbol') {
    if (object) {
      // @ts-ignore
      return object[prop];
    } else if (!object) {
      // @ts-ignore
      return (o: Object) => o[prop];
    }
  } else if (prop === __ && !!object) {
    // @ts-ignore
    return (p: string) => object[p];
  } else {
    throw new Error(errMsg);
  }
};
prop.__ = __;
export {prop};
