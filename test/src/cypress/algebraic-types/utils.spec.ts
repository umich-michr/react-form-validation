import {curry, prop} from './utils';

describe('Currying is a transformation of functions, which translates a function from callable as f(a, b, c,...,n) into callable as f(a)(b)(c)...(n) ', () => {
  it("When an empty function is passed And the resulting function is called Then there shouldn't be any error thrown", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const actual = curry(() => {});
    expect(actual).not.to.throw(Error);
  });
  it('When 4 argument function is passed Then the resulting function should return one function argument each time when called and the 4th function should return the result.', () => {
    const add4 = (a: number, b: number, c: number, d: number) => {
      return a + b + c + d;
    };
    const actual = curry(add4);
    expect(actual(1)(2)(3)(4)).to.equal(add4(1, 2, 3, 4));
  });
});

describe('prop function should return an attribute of an object when either one of attribute or object is supplied as an argument or when both are supplied', () => {
  const testObjectKey = 'a',
    testObjectValue = 1,
    testObject = {[testObjectKey]: testObjectValue},
    testObjectString = JSON.stringify(testObject);
  it(`When prop is ${testObjectKey} and object is ${testObjectString} Then ${testObjectValue} should be returned`, () => {
    const actualValue = prop(testObjectKey, testObject);
    expect(actualValue).to.equal(testObjectValue);
  });
  /* eslint-disable @babel/no-unused-expressions */
  it(`When prop is non-existing object key and object is ${testObjectString} Then undefined should be returned`, () => {
    expect(prop('b', testObject)).to.be.undefined;
    expect(prop(prop.__, testObject)('')).to.be.undefined;
    expect(prop('')(testObject)).to.be.undefined;
  });
  it(`When prop is prop.__ (prop arg placeholder to curry) and object is ${testObjectString} And the resulting function is supplied with ${testObjectKey} Then ${testObjectValue} should be returned`, () => {
    const actualValue = prop(prop.__, testObject)(testObjectKey);
    expect(actualValue).to.equal(testObjectValue);
  });
  it(`When prop is ${testObjectKey} and object is not specified And the resulting function is supplied with ${testObjectString} Then ${testObjectValue} should be returned`, () => {
    const actualValue = prop(testObjectKey)(testObject);
    expect(actualValue).to.equal(testObjectValue);
  });
  it('Error cases', () => {
    const Error = "Make sure usage was like one of: prop('a',{a:1}),prop(prop.__,{a:1})('a'), prop('a')({a:1})";
    expect(() => prop(prop.__)).to.throw(Error);
    expect(() => prop(prop.__)(undefined)).to.throw(Error);
    expect(() => prop(prop.__)(testObject)).to.throw(Error);
    expect(() => prop('a')(undefined)).to.throw("Cannot read properties of undefined (reading 'a')");
  });
});
