/* istanbul ignore file */

// universal implementation of nodeUtf8ToBase64/nodeBase64ToUtf8 methods for browsers, Node, and Deno.
//
// - good docs on base64
//   https://developer.mozilla.org/en-US/docs/Glossary/Base64
// - great insights on why escape/unescape is needed
//   https://stackoverflow.com/questions/30631927/converting-to-base64-in-javascript-without-deprecated-escape-call
//
// Known problem with atob/btoa:
// https://github.com/octokit/plugin-create-or-update-text-file.js/issues/15

const isNode =
  globalThis.process &&
  globalThis.process.release &&
  globalThis.process.release.name;

function browserUtf8ToBase64(data: string) {
  return btoa(unescape(encodeURIComponent(data)));
}

function browserBase64ToUtf8(data: string) {
  return decodeURIComponent(escape(atob(data)));
}

function nodeUtf8ToBase64(data: string) {
  return Buffer.from(data, "utf-8").toString("base64");
}

function nodeBase64ToUtf8(data: string) {
  return Buffer.from(data, "base64").toString("utf-8");
}

export const utf8ToBase64 = isNode ? nodeUtf8ToBase64 : browserUtf8ToBase64;
export const base64ToUtf8 = isNode ? nodeBase64ToUtf8 : browserBase64ToUtf8;
