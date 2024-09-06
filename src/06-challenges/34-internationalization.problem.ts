import { expect, it } from "vitest";

type GetParamKeys<TTranslation extends string> =
  TTranslation extends `${string}{${infer Param}}${infer Tail}`
    ? [Param, ...GetParamKeys<Tail>]
    : [];

// So many subtle things going on here:
// - Translations extends Record<string, string> to ensure its values can be typed as string
//   for GetParamKeys
// - Default type for TParamKeys lets us capture it rather than using GetParamKeys<Translations[TranslationKey]>
//   everywhere multiple times
// - TParamKeys extends string[] allows us to use these as keys in the record under args
// - Record<TParamKeys[number], string> uses indexed access into an array of param keys to
//   convert it to a type union that becomes the keys of the record. 🤯
// I was actually pretty close to getting this one! I forgot about the number trick to
const translate = <
  Translations extends Record<string, string>,
  TranslationKey extends keyof Translations,
  TParamKeys extends string[] = GetParamKeys<Translations[TranslationKey]>
>(
  translations: Translations,
  key: TranslationKey,
  ...args: TParamKeys extends []
    ? []
    : [params: Record<TParamKeys[number], string>]
) => {
  const translation = translations[key];
  const params: any = args[0] || {};

  return translation.replace(/{(\w+)}/g, (_, key) => params[key]);
};

// TESTS

const translations = {
  title: "Hello, {name}!",
  subtitle: "You have {count} unread messages.",
  button: "Click me!",
} as const;

it("Should translate a translation without parameters", () => {
  const buttonText = translate(translations, "button");

  expect(buttonText).toEqual("Click me!");
});

it("Should translate a translation WITH parameters", () => {
  const subtitle = translate(translations, "subtitle", {
    count: "2",
  });

  expect(subtitle).toEqual("You have 2 unread messages.");
});

it("Should force you to provide parameters if required", () => {
  // @ts-expect-error
  translate(translations, "title");
});

it("Should not let you pass parameters if NOT required", () => {
  // @ts-expect-error
  translate(translations, "button", {});
});
