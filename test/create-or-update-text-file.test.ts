import fetchMock from "fetch-mock";
import { Octokit } from "@octokit/core";

import { createOrUpdateTextFile } from "../src";
import { utf8ToBase64 } from "../src/utils";

const MyOctokit = Octokit.plugin(createOrUpdateTextFile).defaults({
  userAgent: "test",
});

describe("README usage examples", () => {
  it("Creates file with static content if no file exists at given path", async () => {
    const mock = fetchMock
      .sandbox()

      // file does not exist
      .getOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {},
          status: 404,
        },
      )

      // create file
      .putOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {
            ok: true,
          },
          status: 201,
        },
        {
          body: {
            content: utf8ToBase64("content here"),
            message: "update test.txt",
          },
        },
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    const { updated, data } = await octokit.createOrUpdateTextFile({
      owner: "octocat",
      repo: "hello-world",
      path: "test.txt",
      content: "content here",
      message: "update test.txt",
    });

    expect(updated).toEqual(true);
    expect(data).toEqual({ ok: true });
  });

  it("Creates file with static content if file exists at given path", async () => {
    const mock = fetchMock
      .sandbox()

      // file exists
      .getOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {
            content: utf8ToBase64("current content"),
            sha: "sha123",
          },
          status: 200,
        },
      )

      // update file
      .putOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {
            ok: true,
          },
          status: 200,
        },
        {
          body: {
            content: utf8ToBase64("content here"),
            message: "update test.txt",
            sha: "sha123",
          },
        },
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    const { updated, data } = await octokit.createOrUpdateTextFile({
      owner: "octocat",
      repo: "hello-world",
      path: "test.txt",
      content: "content here",
      message: "update test.txt",
    });

    expect(updated).toEqual(true);
    expect(data).toEqual({ ok: true });
  });

  it("Sends no delete request when content is set to null and no file exists at given path", async () => {
    const mock = fetchMock
      .sandbox()

      // file does not exist
      .getOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {},
          status: 404,
        },
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    const { updated, deleted, data } = await octokit.createOrUpdateTextFile({
      owner: "octocat",
      repo: "hello-world",
      path: "test.txt",
      content: null,
      message: "update test.txt",
    });

    expect(deleted).toEqual(false);
    expect(updated).toEqual(false);
    expect(data).toEqual({});
  });

  it("Deletes file when content is set to null and a file exists at given path", async () => {
    const mock = fetchMock
      .sandbox()

      // file exists
      .getOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {
            content: utf8ToBase64("current content"),
            sha: "sha123",
          },
          status: 200,
        },
      )

      // delete file
      .deleteOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {
            ok: true,
          },
          status: 200,
        },
        {
          body: {
            sha: "sha123",
            message: "delete test.txt",
          },
        },
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    const { updated, deleted, data } = await octokit.createOrUpdateTextFile({
      owner: "octocat",
      repo: "hello-world",
      path: "test.txt",
      content: null,
      message: "delete test.txt",
    });

    expect(deleted).toEqual(true);
    expect(updated).toEqual(true);
    expect(data).toEqual({
      ok: true,
    });
  });

  it("set content dynamically based on current content using a content function (file does not exist)", async () => {
    const mock = fetchMock
      .sandbox()

      // file does not exist
      .getOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {},
          status: 404,
        },
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    const { updated, deleted, data } = await octokit.createOrUpdateTextFile({
      owner: "octocat",
      repo: "hello-world",
      path: "test.txt",
      content({ content }) {
        // do not create file
        if (content === null) return null;

        return content.toUpperCase();
      },
      message: "update test.txt",
    });

    expect(deleted).toEqual(false);
    expect(updated).toEqual(false);
    expect(data).toEqual({});
  });

  it("set content dynamically based on current content using a content function (file does exist)", async () => {
    const mock = fetchMock
      .sandbox()

      // file exists
      .getOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {
            content: utf8ToBase64("current content"),
            sha: "sha123",
          },
          status: 200,
        },
      )

      // update file
      .putOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {
            ok: true,
          },
          status: 200,
        },
        {
          body: {
            content: utf8ToBase64("CURRENT CONTENT"),
            message: "update test.txt",
            sha: "sha123",
          },
        },
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    const { updated, deleted, data } = await octokit.createOrUpdateTextFile({
      owner: "octocat",
      repo: "hello-world",
      path: "test.txt",
      content({ content }) {
        // do not create file
        if (content === null) return null;

        return content.toUpperCase();
      },
      message: "update test.txt",
    });

    expect(deleted).toEqual(false);
    expect(updated).toEqual(true);
    expect(data).toEqual({ ok: true });
  });

  it("Creates file with static content if file exists at given path and branch", async () => {
    const mock = fetchMock
      .sandbox()

      // file exists
      .getOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt?ref=custom-branch",
        {
          body: {
            content: utf8ToBase64("current content"),
            sha: "sha123",
            ref: "custom-branch",
          },
          status: 200,
        },
      )

      // update file
      .putOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {
            ok: true,
          },
          status: 200,
        },
        {
          body: {
            content: utf8ToBase64("content here"),
            message: "update test.txt",
            sha: "sha123",
            branch: "custom-branch",
          },
        },
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    const { updated, data } = await octokit.createOrUpdateTextFile({
      owner: "octocat",
      repo: "hello-world",
      path: "test.txt",
      content: "content here",
      message: "update test.txt",
      branch: "custom-branch",
    });

    expect(updated).toEqual(true);
    expect(data).toEqual({ ok: true });
  });
});

// TODO: add test for browsers
// https://github.com/octokit/plugin-create-or-update-text-file.js/issues/15#issuecomment-840734343
// example response
//
//     {
//       "name": "update-prettier.yml",
//       "path": ".github/workflows/update-prettier.yml",
//       "sha": "c5ce51905f4941cfce3ee663113f4dbda080570c",
//       "size": 650,
//       "url": "https://api.github.com/repos/wolfy1339/test-repository/contents/.github/workflows/update-prettier.yml?ref=6c46223b6d3464bb5d17773d42ad557524e56d2c",
//       "html_url": "https://github.com/wolfy1339/test-repository/blob/6c46223b6d3464bb5d17773d42ad557524e56d2c/.github/workflows/update-prettier.yml",
//       "git_url": "https://api.github.com/repos/wolfy1339/test-repository/git/blobs/c5ce51905f4941cfce3ee663113f4dbda080570c",
//       "download_url": "https://raw.githubusercontent.com/wolfy1339/test-repository/6c46223b6d3464bb5d17773d42ad557524e56d2c/.github/workflows/update-prettier.yml",
//       "type": "file",
//       "content": "bmFtZTogVXBkYXRlIFByZXR0aWVyCiJvbiI6CiAgcHVzaDoKICAgIGJyYW5j\naGVzOgogICAgICAtIGRlcGVuZGFib3QvbnBtX2FuZF95YXJuL3ByZXR0aWVy\nLSoKam9iczoKICB1cGRhdGVfcHJldHRpZXI6CiAgICBydW5zLW9uOiB1YnVu\ndHUtbGF0ZXN0CiAgICBzdGVwczoKICAgICAgLSB1c2VzOiBhY3Rpb25zL2No\nZWNrb3V0QHYyCiAgICAgIC0gdXNlczogYWN0aW9ucy9zZXR1cC1ub2RlQHYy\nCiAgICAgICAgd2l0aDoKICAgICAgICAgIG5vZGUtdmVyc2lvbjogMTIueAog\nICAgICAtIHJ1bjogbnBtIGNpCiAgICAgIC0gcnVuOiAibnBtIHJ1biBsaW50\nOmZpeCIKICAgICAgLSB1c2VzOiBncjJtL2NyZWF0ZS1vci11cGRhdGUtcHVs\nbC1yZXF1ZXN0LWFjdGlvbkB2MS54CiAgICAgICAgZW52OgogICAgICAgICAg\nR0lUSFVCX1RPS0VOOiAiJHt7IHNlY3JldHMuT0NUT0tJVEJPVF9QQVQgfX0i\nCiAgICAgICAgd2l0aDoKICAgICAgICAgIHRpdGxlOiBQcmV0dGllciB1cGRh\ndGVkCiAgICAgICAgICBib2R5OiBBbiB1cGRhdGUgdG8gcHJldHRpZXIgcmVx\ndWlyZWQgdXBkYXRlcyB0byB5b3VyIGNvZGUuCiAgICAgICAgICBicmFuY2g6\nICIke3sgZ2l0aHViLnJlZiB9fSIKICAgICAgICAgIGNvbW1pdC1tZXNzYWdl\nOiAic3R5bGU6IHByZXR0aWVyIgo=\n",
//       "encoding": "base64",
//       "_links": {
//         "self": "https://api.github.com/repos/wolfy1339/test-repository/contents/.github/workflows/update-prettier.yml?ref=6c46223b6d3464bb5d17773d42ad557524e56d2c",
//         "git": "https://api.github.com/repos/wolfy1339/test-repository/git/blobs/c5ce51905f4941cfce3ee663113f4dbda080570c",
//         "html": "https://github.com/wolfy1339/test-repository/blob/6c46223b6d3464bb5d17773d42ad557524e56d2c/.github/workflows/update-prettier.yml"
//       }
//     }
