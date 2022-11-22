/* eslint-disable @typescript-eslint/no-explicit-any */
export class Maybe<T> {
  private readonly value: T;
  constructor(val: T) {
    this.value = val;
  }
  private join() {
    return this.value;
  }
  inspect() {
    if (!this.isNothing()) {
      return `Maybe(${JSON.stringify(this.join())})`;
    }
    return 'Nothing';
  }
  isNothing() {
    return !this.value;
  }
  /**
   * map :: Monad m => (a -> b) -> m a -> m b
   */
  map(f: (val: T) => any): Maybe<any> {
    if (this.isNothing()) {
      return Maybe.of(null);
    }
    return Maybe.of(f(this.value));
  }
  /**
   * A combinator, typically called bind (as in binding a variable) and represented with an infix operator >>= or a method called flatMap, that unwraps a monadic variable, then inserts it into a monadic function/expression, resulting in a new monadic value
   * (>>=) : (M T, T → M U) → M U[g] so if mx : M T and f : T → M U, then (mx >>= f) : M U
   * bind/flatMap/chain :: Monad m => (a -> mb ) -> m a -> m b
   */
  bind(f: (val: T) => Maybe<any>) {
    return this.map(f).join();
  }
  /**
   * when value is a function, ap applies that function to the maybe passed as argument and returns the resulting maybe
   * ap :: Monad m => m (a -> b) -> m a -> m b
   */
  ap(otherMaybe: Maybe<any>) {
    return otherMaybe.map(this.value as (val: any) => any);
  }
  /**
   * orElse :: Monad m => m a -> a -> m a
   */
  orElse(def: any) {
    if (this.isNothing()) {
      return Maybe.of(def);
    }
    return this;
  }
  /**
   * If there's a wrapped value then the function will be applied to the value and the return value will be returned
   */
  onSome(f: (val: any) => any) {
    if (!this.isNothing()) {
      return f(this.value);
    }
  }
  /**
   * If there's no wrapped value then the function will be called and the return value will be returned
   */
  onNothing(f: () => any) {
    if (this.isNothing()) {
      return f();
    }
  }
  static of<T>(val: T) {
    return new Maybe<T>(val);
  }
}
