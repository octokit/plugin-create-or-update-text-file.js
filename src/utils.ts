/* istanbul ignore file */

// universal implementation of nodeUtf8ToBase64/nodeBase64ToUtf8 methods for browsers, Node, and Deno.
//
// - good docs on base64
//   https://developer.mozilla.org/en-US/docs/Glossary/Base64
// - great insights on why escape/unescape is needed
//   https://stackoverflow.com/questions/30631927/converting-to-base64-in-javascript-without-deprecated-escape-call

const hasAtob = "atob" in globalThis;

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

export const utf8ToBase64 = hasAtob ? browserUtf8ToBase64 : nodeUtf8ToBase64;
export const base64ToUtf8 = hasAtob ? browserBase64ToUtf8 : nodeBase64ToUtf8;
