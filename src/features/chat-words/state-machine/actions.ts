import { assign } from "xstate";
import { Context, Event } from "./machine";
import { excludedWords } from "./excludedWords";

export const processMessage = assign<Context, Event>((ctx, evt) => {
  if (evt.type !== "MESSAGE") {
    return ctx;
  }

  let words = evt.payload.message.toLowerCase().split(" ") || [];

  words = Array.from(new Set(words));

  // @TODO: exclude links/URLs

  // reject commands
  words = words.filter((word) => word.indexOf("!") !== 0);

  // strip out special characters
  words = words.map((word) => word.replace(/[^a-z\-]/g, ""));

  // reject the excluded words
  // "is alpha beta is a gamma a" => "alpha beta gamma"
  // ["a", "is"] => `(a|is)`
  const excludedWordsRegex = excludedWords.join("|");
  let wordsStr = " " + words.join(" ") + " ";
  const regEx = new RegExp(`(?<=\\s)(${excludedWordsRegex})(?=\\s)`, "g");
  wordsStr = wordsStr
    .replace(regEx, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s/, "")
    .replace(/\s$/, "");
  words = wordsStr.split(" ");

  // limit words to 10 chars
  words = words.map((word) => word.slice(0, 10));

  if (words.length === 0) {
    return ctx;
  }

  const newWords = new Map(ctx.words);

  words.forEach((word) => {
    if (newWords.has(word)) {
      // @ts-ignore
      newWords.set(word, newWords.get(word) + 1);
    } else {
      newWords.set(word, 1);
    }
  });

  return {
    words: newWords,
  };
});

export const reset = assign<Context, Event>((ctx, evt) => {
  if (evt.type !== "RESET") {
    return ctx;
  }
  return {
    words: new Map(),
  };
});

export const start = assign<Context, Event>((ctx, evt) => {
  if (evt.type !== "START") {
    return ctx;
  }
  return {
    words: new Map(),
  };
});
