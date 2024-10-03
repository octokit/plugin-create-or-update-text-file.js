import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      reporter: ["html", "text", "json"],
      thresholds: {
        100: true,
      },
      reportOnFailure: true,
    },
  },
});
