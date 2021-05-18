# plugin-create-or-update-text-file.js

> Convenience method to create/edit/delete a text file based on its current content

[![@latest](https://img.shields.io/npm/v/@octokit/plugin-create-or-update-text-file.svg)](https://www.npmjs.com/package/@octokit/plugin-create-or-update-text-file)
[![Build Status](https://github.com/octokit/plugin-create-or-update-text-file.js/workflows/Test/badge.svg)](https://github.com/octokit/plugin-create-or-update-text-file.js/actions?query=workflow%3ATest+branch%3Amain)

<details><summary>Table of contents</summary>

<!-- toc -->

- [Usage](#usage)
  - [Create custom Octokit contructor with plugin](#create-custom-octokit-contructor-with-plugin)
  - [Create or update existing file with static content](#create-or-update-existing-file-with-static-content)
  - [deleting a file is possible by setting content to null](#deleting-a-file-is-possible-by-setting-content-to-null)
  - [set content dynamically based on current content using a content function](#set-content-dynamically-based-on-current-content-using-a-content-function)
  - [Direct usage (not as plugin)](#direct-usage-not-as-plugin)
- [Options](#options)
- [Types](#types)
- [Contributing](#contributing)
- [License](#license)

<!-- tocstop -->

</details>

## Usage

<table>
<tbody valign=top align=left>
<tr><th>

Browsers

</th><td width=100%>

Load `@octokit/plugin-create-or-update-text-file` and [`@octokit/core`](https://github.com/octokit/core.js) (or core-compatible module) directly from [cdn.pika.dev](https://cdn.pika.dev)

```html
<script type="module">
  import { Octokit } from "https://cdn.pika.dev/@octokit/core";
  import {
    createOrUpdateTextFile,
    composeCreateOrUpdateTextFile,
  } from "https://cdn.pika.dev/@octokit/plugin-create-or-update-text-file";
</script>
```

</td></tr>
<tr><th>

Node

</th><td>

Install with `npm install @octokit/core @octokit/plugin-create-or-update-text-file`. Optionally replace `@octokit/core` with a compatible module

```js
const { Octokit } = require("@octokit/core");
const {
  createOrUpdateTextFile,
  composeCreateOrUpdateTextFile,
} = require("@octokit/plugin-create-or-update-text-file");
```

</td></tr>
</tbody>
</table>

### Create custom Octokit contructor with plugin

```js
const MyOctokit = Octokit.plugin(createOrUpdateTextFile);
const octokit = new MyOctokit({ auth: "secret123" });
```

### Create or update existing file with static content

```js
const {
  updated,
  data: { commit },
} = await octokit.createOrUpdateTextFile({
  owner: "octocat",
  repo: "hello-world",
  path: "test.txt",
  content: "content here",
  message: "update test.txt",
});

if (updated) {
  console.log("test.txt updated via %s", data.commit.html_url);
} else {
  console.log("test.txt already up to date");
}
```

### deleting a file is possible by setting content to null

```js
const { deleted } = await octokit.createOrUpdateTextFile({
  owner: "octocat",
  repo: "hello-world",
  path: "test.txt",
  content: null,
  message: "delete test.txt",
});

if (deleted) {
  console.log("test.txt deleted via %s", data.commit.html_url);
} else {
  console.log("test.txt does not exist");
}
```

### set content dynamically based on current content using a content function

```js
const { updated, deleted, data } = await octokit.createOrUpdateTextFile({
  owner: "octocat",
  repo: "hello-world",
  path: "test.txt",
  content({ exists, content }) {
    // do not create file
    if (!exists) return null;

    return content.toUpperCase();
  },
  message: "update test.txt",
});
```

### Direct usage (not as plugin)

```js
const octokit = new Octokit({ auth: "secret123" });

await { updated, deleted, data } = await createOrUpdateTextFile(octokit, {
  owner: "octocat",
  repo: "hello-world",
  path: "test.txt",
  content: "content here",
  message: "update test.txt",
});
```

## Options

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>owner</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required.</strong> Repository owner login
      </td>
    </tr>
    <tr>
      <th>
        <code>repo</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required.</strong> Repository repository name
      </td>
    </tr>
    <tr>
      <th>
        <code>path</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required.</strong> Path to repository file within the repository
      </td>
    </tr>
    <tr>
      <th>
        <code>path</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required.</strong> Path to repository file within the repository
      </td>
    </tr>
    <tr>
      <th>
        <code>message</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required.</strong> Commit message in case an update is necessary
      </td>
    </tr>
    <tr>
      <th>
        <code>content</code>
      </th>
      <th>
        <code>string | null | function</code>
      </th>
      <td>

**Required.**

Set to a `string` in order to set the new content of the file.

Set to `null` in order to delete the file (if it exists).

Set to a function that either returns `string`, `null`, or a Promise that resolves to the same. The function receives one options argument

1. `options.exists`: `true` if a file exists at the given path, `false` if it does not.
2. `options.content`: A `string` in case the file exists, otherwise `null`

</td>
    </tr>
    <tr>
      <th>branch</th>
      <th><code>string</code></th>
      <td>The repository branch on which to update the file. Defaults to the repository's default branch</td>
    </tr>
    <tr>
      <th>committer</th>
      <th><code>object</code></th>
      <td>Same as the <a href="https://docs.github.com/en/rest/reference/repos#committer-object"><code>committer</code> object</a> from the <a href="https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents"><code>PUT /repos/{owner}/{repo}/contents/{path}</code> REST API endpoint</a></td>
    </tr>
    <tr>
      <th>author</th>
      <th><code>object</code></th>
      <td>Same as the <a href="https://docs.github.com/en/rest/reference/repos#author-object"><code>author</code> object</a> from the <a href="https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents"><code>PUT /repos/{owner}/{repo}/contents/{path}</code> REST API endpoint</a></td>
    </tr>
  </tbody>
</table>

## Types

You can import the method options and response types as well as the type of the `content` update function

```ts
export {
  Options,
  ContentUpdateFunction,
  Response,
} from "@octokit/plugin-create-or-update-text-file";
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)
