/* eslint-disable @babel/no-unused-expressions */
import {Maybe} from '@lib/algebraic-types/Maybe';
import {serviceProvided, states, getStateById, collectStatesByOrgIds} from './test-data';
import {prop} from './utils';

const getClientState = (stateId: number) => Maybe.of(getStateById(stateId));

const collectStateNames = (states: any[]) => states.map((state) => state.name);

describe('Testing basic Monadic properties of Maybe', () => {
  it('A type constructor that builds up a monadic type Maybe', () => {
    expect(new Maybe('a') instanceof Maybe).to.be.true;
  });
  it('A type converter, often called unit or return that embeds object x in Monad Maybe', () => {
    expect(Maybe.of('a') instanceof Maybe).to.be.true;
  });
});

describe('Maybe.isNothing tests', () => {
  it('When Maybe is created with empty string or undefined or null Then Maybe.isNothing() should return true', () => {
    expect(Maybe.of('').isNothing()).to.be.true;
    expect(Maybe.of(undefined).isNothing()).to.be.true;
    expect(Maybe.of(null).isNothing()).to.be.true;
  });
  it('When Maybe is created with a value which is not empty string/undefined/null then Maybe.isNothing() should return false', () => {
    expect(Maybe.of('a').isNothing()).to.be.false;
  });
});

describe('Maybe.inspect and Maybe.join tests', () => {
  it('Given Maybe resolves to a value When Maybe.inspect is called Then the string representation of Maybe should be returned', () => {
    expect(Maybe.of('a').inspect()).to.equal('Maybe("a")');
  });
  it("Given Maybe resolves to a Nothing When Maybe.inspect is called Then the 'Nothing' should be returned", () => {
    expect(Maybe.of(null).inspect()).to.equal('Nothing');
  });
});

describe('Maybe.map tests', () => {
  it("Given the fn:(any)=>any returns a value for Maybe.value When fn is passed to Maybe.map Then fn's return value should be returned wrapped in a new Maybe object.", () => {
    const expectedMaybe = Maybe.of(prop('clients', serviceProvided));
    const actualMaybe = Maybe.of(serviceProvided).map(prop('clients'));
    expect(actualMaybe).not.to.equal(expectedMaybe);
    expect(actualMaybe).to.deep.equal(expectedMaybe);
  });
  it("Given the fn:(any)=>any doesn't not return a value for Maybe.value When fn is passed to Maybe.map Then a new Maybe object should be returned with Nothing.", () => {
    const expectedMaybe = Maybe.of(undefined);
    const actualMaybe = Maybe.of(serviceProvided).map(prop('x'));
    expect(actualMaybe).not.to.equal(expectedMaybe);
    expect(actualMaybe).to.deep.equal(expectedMaybe);
  });
});

describe('Maybe.bind tests (a.k.a. flatMap)', () => {
  it("Given Maybe resolves to a value When fn:a=>Maybe which returns a Maybe resolving to value, is passed to Maybe.bind Then fn's return value should be returned.", () => {
    const expectedMaybe = getClientState(states[0].id);
    const actualMaybe = Maybe.of(states[0].id);
    expect(actualMaybe.bind(getClientState)).not.to.equal(expectedMaybe);
    expect(actualMaybe.bind(getClientState)).to.deep.equal(expectedMaybe);
  });
  it('Given Maybe resolves to Nothing When fn:a=>Maybe is passed to Maybe.bind Then Maybe resolving to Nothing should be returned.', () => {
    const expectedMaybe = getClientState(-1);
    const actualMaybe = Maybe.of(-1).bind(getClientState);
    expect(actualMaybe).not.to.equal(expectedMaybe);
    expect(actualMaybe).to.deep.equal(expectedMaybe);
    expect(actualMaybe.isNothing()).to.be.true;
  });
});

describe('Maybe.orElse tests', () => {
  it('Given Maybe resolves to Nothing When a default value is passed to Maybe.orElse Then default value should be returned.', () => {
    const expectedMaybe = Maybe.of('a');
    const actualMaybe = Maybe.of(null).orElse('a');
    expect(actualMaybe).not.to.equal(expectedMaybe);
    expect(actualMaybe).to.deep.equal(expectedMaybe);
  });
  it('Given Maybe resolves to a value When a default value is passed to Maybe.orElse Then not the default value but the Maybe value should be returned.', () => {
    const testMaybe = Maybe.of('b');
    const expectedMaybe = Maybe.of('a');
    const actualMaybe = testMaybe.orElse('a');
    expect(actualMaybe).not.to.equal(expectedMaybe);
    expect(actualMaybe).to.equal(testMaybe);
  });
});

describe('Maybe.ap tests', () => {
  it("Given Maybe resolves to a fn:(Maybe)=>Maybe When Maybe.ap is passed another Maybe Then the fn should be applied to the other Maybe and fn's return value should be returned", () => {
    const expectedMaybe = Maybe.of(states[1]);
    const actualMaybe = Maybe.of(1)
      .map((val) => (states: any[]) => states[val])
      .ap(Maybe.of(states));
    expect(actualMaybe).not.to.equal(expectedMaybe);
    expect(actualMaybe).to.deep.equal(expectedMaybe);
  });
  it('Given Maybe resolves to Nothing When Maybe.ap is passed another Maybe Then function call on undefined will throw error', () => {
    expect(Maybe.of(null).ap).to.throw("Cannot read properties of undefined (reading 'map')");
  });
  it('Given Maybe resolves to a function When Maybe.ap is passed another Maybe resolving to Nothing Then Nothing should be returned', () => {
    const expectedMaybe = Maybe.of(null);
    const actualMaybe = Maybe.of((val: any[]) => val[1]).ap(expectedMaybe);
    expect(actualMaybe).not.to.equal(expectedMaybe);
    expect(actualMaybe).to.deep.equal(expectedMaybe);
  });
  it('Given Maybe resolves to fn:Maybe->Maybe When Maybe.ap is passed another Maybe resolving to a value Then fn should be applied to the other maybe and the result should be returned', () => {
    const expectedMaybe = Maybe.of(states[1]);
    const actualMaybe = Maybe.of((val: any[]) => val[1]).ap(Maybe.of(states));
    expect(actualMaybe).not.to.equal(expectedMaybe);
    expect(actualMaybe).to.deep.equal(expectedMaybe);
  });
});

describe('Maybe.onSome tests', () => {
  it("Given Maybe resolves to a value When Maybe.onSome is passed a function Then the function should be applied to the wrapped value and function's return value should be returned as is.", () => {
    const states = Maybe.of(serviceProvided)
      .map(prop('clients') as () => any)
      .map(collectStatesByOrgIds)
      .onSome(collectStateNames);

    expect(states).to.deep.equal(['Pennsylvania', 'Massachusetts']);
  });
  it('Given Maybe resolves to Nothing When Maybe.onSome is passed a function Then undefined should be returned', () => {
    const states = Maybe.of(serviceProvided).map(prop('x')).map(collectStatesByOrgIds).onSome(collectStateNames);

    expect(states).to.be.undefined;
  });
});

describe('Maybe.onNothing tests', () => {
  it('Given Maybe resolves to a value When Maybe.onNothing is passed a function Then the function should not be called', () => {
    const actual = Maybe.of('a').onNothing(() => 'test');
    expect(actual).to.be.undefined;
  });
  it('Given Maybe resolves to Nothing When Maybe.onNothing is passed a function Then the function return value should be returned', () => {
    const expected = 'test';
    const actual = Maybe.of(undefined).onNothing(() => expected);
    expect(actual).to.equal(expected);
  });
});
