import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

// Another option: capture func as any => any:
//   <TFunc extends (...args: any[]) => any>
// then capture the params and returns using built in type helpers:
//   ...args: Parameters<TFunc>
//   result: ReturnType<TFunc>
// The only difference will be in the captured type annotation at the call-site.
// This way gives a named tuple like makeSafe<[a: number, b: number], number>
// The other caputres makeSafe<(a: number, b: number) => number>, which may be
// easier to read.
const makeSafe =
  <TParams extends any[], TResult>(func: (...params: TParams) => TResult) =>
  (
    ...args: TParams
  ):
    | {
        type: "success";
        result: TResult;
      }
    | {
        type: "failure";
        error: Error;
      } => {
    try {
      const result = func(...args);

      return {
        type: "success",
        result,
      };
    } catch (e) {
      return {
        type: "failure",
        error: e as Error,
      };
    }
  };

it("Should properly match the function's arguments", () => {
  const func = makeSafe((a: number, b: string) => {
    return `${a} ${b}`;
  });

  // @ts-expect-error
  func();

  // @ts-expect-error
  func(1, 1);

  func(1, "1");
});
