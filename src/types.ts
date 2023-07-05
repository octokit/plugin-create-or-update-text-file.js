import type { Endpoints } from "@octokit/types";

type User = {
  name: string;
  email: string;
  date?: string;
};

export type Options = {
  owner: string;
  repo: string;
  path: string;
  content: string | null | ContentUpdateFunction;
  message: string;
  branch?: string;
  committer?: User;
  author?: User;
};

export type ContentUpdateFunctionOptions =
  | {
      exists: true;
      content: string;
    }
  | {
      exists: false;
      content: null;
    };

export type ContentUpdateFunction = (
  options: ContentUpdateFunctionOptions,
) => string | null | Promise<string | null>;

export type Response =
  | { updated: false; deleted: false; data: {}; headers: {} }
  | ({
      updated: true;
      deleted: true;
    } & Endpoints["DELETE /repos/{owner}/{repo}/contents/{path}"]["response"])
  | ({
      updated: true;
      deleted: false;
      content: string;
    } & Endpoints["PUT /repos/{owner}/{repo}/contents/{path}"]["response"]);
