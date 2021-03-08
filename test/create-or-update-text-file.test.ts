import * as fetchMock from "fetch-mock";
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
        }
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
        }
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
    expect(data).toStrictEqual({ ok: true });
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
        }
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
        }
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
    expect(data).toStrictEqual({ ok: true });
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
        }
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
    expect(data).toStrictEqual({});
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
        }
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
        }
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
    expect(data).toStrictEqual({
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
        }
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
    expect(data).toStrictEqual({});
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
        }
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
        }
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
    expect(data).toStrictEqual({ ok: true });
  });
});
