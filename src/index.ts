import { Octokit } from "@octokit/core";

import { composeCreateOrUpdateTextFile } from "./compose-create-or-update-text-file.js";
import { VERSION } from "./version.js";
import type { Options } from "./types.js";

export { composeCreateOrUpdateTextFile } from "./compose-create-or-update-text-file.js";
export type { Options, Response, ContentUpdateFunction } from "./types.js";

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
