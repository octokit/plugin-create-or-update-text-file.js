import { Octokit } from "@octokit/core";

import { composeCreateOrUpdateTextFile } from "./compose-create-or-update-text-file";
import { VERSION } from "./version";
import type { Options } from "./types";

export { composeCreateOrUpdateTextFile } from "./compose-create-or-update-text-file";
export type { Options, Response, ContentUpdateFunction } from "./types";

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
