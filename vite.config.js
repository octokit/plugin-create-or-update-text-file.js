import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/utils.ts"],
      reporter: ["html", "text", "json"],
      thresholds: {
        100: true,
      },
      reportOnFailure: true,
    },
  },
});
