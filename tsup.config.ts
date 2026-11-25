import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  platform: "node",
  outDir: "dist",
  clean: true,
  splitting: false,
  sourcemap: false,
  banner: { js: "#!/usr/bin/env node" },
  // Exchange SDKs and the MCP SDK stay as runtime dependencies.
  skipNodeModulesBundle: true,
});
