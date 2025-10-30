import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom", // Reactなどを扱うときに必要
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"), // 👈 「@」をプロジェクトルートにマッピング
    },
  },
});
