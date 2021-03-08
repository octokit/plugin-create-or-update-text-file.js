import { Octokit } from "@octokit/core";

import { getFileContents } from "./get-file-content";
import { Options, Response, ContentUpdateFunctionOptions } from "./types";
import { utf8ToBase64 } from "./utils";

/**
 *
 * @param octokit Octokit instance
 * @param options
 */
export async function composeCreateOrUpdateTextFile(
  octokit: Octokit,
  options: Options
): Promise<Response> {
  const {
    content: contentOrFn,
    message,
    committer,
    author,
    ...getOptions
  } = options;
  const currentFile = await getFileContents(octokit, getOptions);

  // normalize content
  const content =
    typeof contentOrFn === "function"
      ? await contentOrFn({
          exists: currentFile.content !== null,
          content: currentFile.content,
        } as ContentUpdateFunctionOptions)
      : contentOrFn;

  // do nothing if there are no changes
  if (content === currentFile.content) {
    return {
      updated: false,
      deleted: false,
      data: {},
      headers: {},
    };
  }

  // delete file if it exists and new content is `null`
  if (currentFile.sha && content === null) {
    // https://docs.github.com/en/rest/reference/repos#delete-a-file
    const response = await octokit.request(
      "DELETE /repos/{owner}/{repo}/contents/{path}",
      {
        ...getOptions,
        message,
        sha: currentFile.sha,
      }
    );

    return {
      ...response,
      updated: true,
      deleted: true,
    };
  }

  // update file to new content
  // https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
  const response = await octokit.request(
    "PUT /repos/{owner}/{repo}/contents/{path}",
    {
      ...getOptions,
      message,
      ...currentFile,
      content: utf8ToBase64(content as string),
    }
  );

  return {
    ...response,
    updated: true,
    deleted: false,
    content: content as string,
  };
}
