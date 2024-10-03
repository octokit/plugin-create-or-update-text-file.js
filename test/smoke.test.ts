import { createOrUpdateTextFile, composeCreateOrUpdateTextFile } from "../src";
import { describe, it, expect } from "vitest";

describe("createOrUpdateTextFile", () => {
  it("is a function", () => {
    expect(createOrUpdateTextFile).toBeInstanceOf(Function);
  });

  it("createOrUpdateTextFile.VERSION is set", () => {
    expect(createOrUpdateTextFile.VERSION).toEqual("0.0.0-development");
  });
});

describe("composeCreateOrUpdateTextFile", () => {
  it("is a function", () => {
    expect(composeCreateOrUpdateTextFile).toBeInstanceOf(Function);
  });
});
