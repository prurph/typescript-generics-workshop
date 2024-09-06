import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

// Wow this is like how Scala defined Tuple22 and hence case classes could have up to 22
// fields.
// There are some solutions that don't involve overloads here: https://stackoverflow.com/q/49310886
// They generally have the drawback that the compiler can't veriy the intermediate types of
// functions in the pipeline line up. There is one nutso solution here: https://stackoverflow.com/a/75027276
// (an answer to that thread) that does do this by using conditional types to replace
// mismatched return/parameter pairs in the type signature with a literal string type.
// This does get the squiggly error in the correct parameter spot, but the error is like:
// Argument of type '(a: string) => number' is not assignable to parameter of type '"INVALID_COMPOSABLE"',
// so I wouldn't consider it an absolutely ideal solution.
// The "best" way to do it might be to not permit varargs and instead do compose(f, compose(g, compose(h, i)))
// or introduce object wrappers to do compose(f).compose(g).compose(h)
export function compose<T1, T2>(func: (t1: T1) => T2): (t1: T1) => T2;
export function compose<T1, T2, T3>(
  func1: (t1: T1) => T2,
  func2: (t2: T2) => T3
): (t1: T1) => T3;
export function compose<T1, T2, T3, T4>(
  func1: (t1: T1) => T2,
  func2: (t2: T2) => T3,
  func3: (t3: T3) => T4
): (t1: T1) => T4;
export function compose<T1, T2, T3, T4, T5>(
  func1: (t1: T1) => T2,
  func2: (t2: T2) => T3,
  func3: (t3: T3) => T4,
  func4: (t4: T4) => T5
): (t1: T1) => T5;
export function compose(...funcs: Array<(input: any) => any>) {
  return (input: any) => {
    return funcs.reduce((acc, fn) => fn(acc), input);
  };
}

const addOne = (num: number) => {
  return num + 1;
};

const addTwoAndStringify = compose(addOne, addOne, String);

it("Should compose multiple functions together", () => {
  const result = addTwoAndStringify(4);

  expect(result).toEqual("6");

  type tests = [Expect<Equal<typeof result, string>>];
});

it("Should error when the input to a function is not typed correctly", () => {
  const stringifyThenAddOne = compose(
    // addOne takes in a number - so it shouldn't be allowed after
    // a function that returns a string!
    // @ts-expect-error
    String,
    addOne
  );
});
