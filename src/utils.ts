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

function nodeUtf8ToBase64(data: string) {
  return Buffer.from(data, "utf-8").toString("base64");
}

function nodeBase64ToUtf8(data: string) {
  return Buffer.from(data, "base64").toString("utf-8");
}

// browserUtf8ToBase64 & browserBase64ToUtf8
// (c) Brandon Rylow - CC BY-SA 4.0
// https://stackoverflow.com/a/30106551/206879
function browserUtf8ToBase64(data: string) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(data).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(_match, p1) {
        // @ts-expect-error - we know what we are doing here
        return String.fromCharCode("0x" + p1);
      }
    )
  );
}

function browserBase64ToUtf8(data: string) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(data)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

export const utf8ToBase64 = isNode ? nodeUtf8ToBase64 : browserUtf8ToBase64;
export const base64ToUtf8 = isNode ? nodeBase64ToUtf8 : browserBase64ToUtf8;
