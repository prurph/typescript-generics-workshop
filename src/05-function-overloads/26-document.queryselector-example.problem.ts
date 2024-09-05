import { Equal, Expect } from "../helpers/type-utils";

const divElement = document.querySelector("div");
const spanElement = document.querySelector("span");

/**
 * Your challenge: figure out why divElement2 is NOT
 * of type HTMLDivElement.
 */
// divElement2 is NOT HTMLDivElement, rather Element because of the overload of
// querySelector that is being invoked. The relevant declarations are:
//   querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
//   querySelector<E extends Element = Element>(selectors: string): E | null;
// The reason this works for `divElement` and `spanElement` is the argument is in HTMLElementTagNameMap,
// however when we pass "div.foo" that no longer works and the more general <E extends Element> overload
// is in play.
const divElement2 = document.querySelector("div.foo");
// We can fix this by specifying the generic type
const divElement3 = document.querySelector<HTMLDivElement>("div.foo");

type tests = [
  Expect<Equal<typeof divElement, HTMLDivElement | null>>,
  Expect<Equal<typeof spanElement, HTMLSpanElement | null>>,
  Expect<Equal<typeof divElement2, Element | null>>,
  Expect<Equal<typeof divElement3, HTMLDivElement | null>>
];
