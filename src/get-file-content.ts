import { RequestError } from "@octokit/request-error";
import { Octokit } from "@octokit/core";
import { base64ToUtf8 } from "./utils";

type Options = {
  owner: string;
  repo: string;
  path: string;
  branch?: string;
};

type GetContentsParameters = {
  owner: string;
  repo: string;
  path: string;
  ref?: string;
};

type Result = {
  content: string | null;
  sha?: string;
};

/**
 * Normalizes the retrival of a repository file content.
 *
 * The "Get repository content" API can respond in 4 different ways depending
 * on what exists at the given path
 *
 * - An array of folder item objects
 * - An object with type = symlink
 * - An object with type = submodule
 * - An object with type = file
 *
 * We are only interested in the last type, and throw errors in all other cases
 *
 * @see https://docs.github.com/en/rest/reference/repos#get-repository-content
 * @param octokit Octokit instance
 * @param options
 */
export async function getFileContents(
  octokit: Octokit,
  options: Options
): Promise<Result> {
  const route = "GET /repos/{owner}/{repo}/contents/{path}";

  const { branch, ...parameters } = options;
  const getContentsParameters: GetContentsParameters = {
    ...parameters,
    ref: branch,
  };

  const requestOptions = octokit.request.endpoint(route, getContentsParameters);

  const { data } = await octokit
    .request(route, getContentsParameters)
    .catch((error: RequestError) => {
      /* istanbul ignore if */
      if (error.status !== 404) throw error;

      return {
        data: {
          content: null,
          type: "",
          sha: "",
        },
      };
    });

  if (Array.isArray(data)) {
    throw new RequestError(
      `[@octokit/plugin-create-or-update-text-file] ${requestOptions.url} is a directory`,
      403,
      {
        request: requestOptions,
      }
    );
  }

  if (!("sha" in data && "content" in data)) {
    throw new RequestError(
      `[@octokit/plugin-create-or-update-text-file] ${requestOptions.url} is not a file, but a ${data.type}`,
      403,
      {
        request: requestOptions,
      }
    );
  }

  if (data.content === null) {
    return {
      content: null,
    };
  }

  try {
    return {
      content: base64ToUtf8(data.content),
      sha: data.sha,
    };
  } catch (error) {
    /* istanbul ignore next */
    if (error.message !== "URI malformed") throw error;

    /* istanbul ignore next error is only thrown in browsers, not node. */
    throw new RequestError(
      `[@octokit/plugin-create-or-update-text-file] ${requestOptions.url} is a binary file, only text files are supported`,
      403,
      {
        request: requestOptions,
      }
    );
  }
}
