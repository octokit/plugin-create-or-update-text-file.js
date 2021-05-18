import * as fetchMock from "fetch-mock";
import { Octokit } from "@octokit/core";

import { createOrUpdateTextFile } from "../src";

const MyOctokit = Octokit.plugin(createOrUpdateTextFile).defaults({
  userAgent: "test",
});

describe("README usage examples", () => {
  test("path is a folder", async () => {
    const mock = fetchMock
      .sandbox()

      // file is a folder
      .getOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: [],
          status: 200,
        }
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    expect(() =>
      octokit.createOrUpdateTextFile({
        owner: "octocat",
        repo: "hello-world",
        path: "test.txt",
        content: "content here",
        message: "update test.txt",
      })
    ).rejects.toThrow(
      "[@octokit/plugin-create-or-update-text-file] https://api.github.com/repos/octocat/hello-world/contents/test.txt is a directory"
    );
  });

  test("path is a symlink", async () => {
    const mock = fetchMock
      .sandbox()

      // file is a folder
      .getOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {
            type: "symlink",
          },
          status: 200,
        }
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    expect(() =>
      octokit.createOrUpdateTextFile({
        owner: "octocat",
        repo: "hello-world",
        path: "test.txt",
        content: "content here",
        message: "update test.txt",
      })
    ).rejects.toThrow(
      "[@octokit/plugin-create-or-update-text-file] https://api.github.com/repos/octocat/hello-world/contents/test.txt is not a file, but a symlink"
    );
  });

  // https://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
  const BLACK_GIF_BASE64 = "R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
  test.skip("path is binary file", async () => {
    const mock = fetchMock
      .sandbox()

      // file is a binary file
      .getOnce(
        "https://api.github.com/repos/octocat/hello-world/contents/test.txt",
        {
          body: {
            type: "file",
            content: BLACK_GIF_BASE64,
          },
          status: 200,
        }
      );

    const octokit = new MyOctokit({
      request: {
        fetch: mock,
      },
    });

    expect(() =>
      octokit.createOrUpdateTextFile({
        owner: "octocat",
        repo: "hello-world",
        path: "test.txt",
        content: "content here",
        message: "update test.txt",
      })
    ).rejects.toThrow("[@octokit/plugin-create-or-update-text-file]");
  });
});
