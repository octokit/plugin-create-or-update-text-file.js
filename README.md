# plugin-create-or-update-text-file.js

> Convenience method to create/edit/delete a text file based on its current content

[![@latest](https://img.shields.io/npm/v/@octokit/plugin-create-or-update-text-file.svg)](https://www.npmjs.com/package/@octokit/plugin-create-or-update-text-file)
[![Build Status](https://github.com/octokit/plugin-create-or-update-text-file.js/workflows/Test/badge.svg)](https://github.com/octokit/plugin-create-or-update-text-file.js/actions?query=workflow%3ATest+branch%3Amain)

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
  import { createOrUpdateTextFile } from "https://cdn.pika.dev/@octokit/plugin-create-or-update-text-file";
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
} = require("@octokit/plugin-create-or-update-text-file");
```

</td></tr>
</tbody>
</table>

```js
const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit({ auth: "secret123" });

// create or update existing file with static content
octokit.createOrUpdateTextFile({
  owner: "octokit",
  repo: "sandbox",
  path: "test.txt",
  content: "content here",
});

// deleting a file is possible by setting content to null
octokit.createOrUpdateTextFile({
  owner: "octokit",
  repo: "sandbox",
  path: "test.txt",
  content: null,
});

// set content dynamically based on current content using a content function
octokit.createOrUpdateTextFile({
  owner: "octokit",
  repo: "sandbox",
  path: "test.txt",
  content({ exists, content }) {
    // do not create file
    if (!exists) return null;

    return content.toUpperCase();
  },
});
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)
