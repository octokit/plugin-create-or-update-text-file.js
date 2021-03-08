import { Octokit } from "@octokit/core";

import { composeCreateOrUpdateTextFile } from "./compose-create-or-update-text-file";
import { VERSION } from "./version";
import { Options } from "./types";

export { composeCreateOrUpdateTextFile } from "./compose-create-or-update-text-file";
export { Options, Response, ContentUpdateFunction } from "./types";

/**
 * @param octokit Octokit instance
 */
export function createOrUpdateTextFile(octokit: Octokit) {
  return {
    createOrUpdateTextFile(options: Options) {
      return composeCreateOrUpdateTextFile(octokit, options);
    },
  };
}
createOrUpdateTextFile.VERSION = VERSION;
