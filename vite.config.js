import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      ignore: ["src/utils.ts"],
      reporter: ["html", "text", "json"],
      thresholds: {
        100: true,
      },
      reportOnFailure: true,
    },
  },
});
