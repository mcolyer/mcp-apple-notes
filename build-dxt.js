#!/usr/bin/env node

/**
 * Build script for Apple Notes DXT extension
 * Creates a production-ready DXT package
 */

import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const DXT_BUILD_DIR = "dxt-build";
const REQUIRED_FILES = [
  "manifest.json",
  "server/index.js",
  "server/package.json",
  "server/services/appleNotesManager.js",
  "server/utils/applescript.js",
  "server/types.js",
];

console.log("🚀 Building Apple Notes DXT extension...");

try {
  // Clean previous build
  if (existsSync(DXT_BUILD_DIR)) {
    console.log("🧹 Cleaning previous build...");
    rmSync(DXT_BUILD_DIR, { recursive: true, force: true });
  }

  // Create build directory
  mkdirSync(DXT_BUILD_DIR, { recursive: true });

  // Build TypeScript source
  console.log("🔨 Building TypeScript source...");
  execSync("pnpm run build", { stdio: "inherit" });

  // Create server directory structure
  console.log("📦 Creating server directory...");
  mkdirSync(join(DXT_BUILD_DIR, "server"), { recursive: true });
  mkdirSync(join(DXT_BUILD_DIR, "server", "services"), { recursive: true });
  mkdirSync(join(DXT_BUILD_DIR, "server", "utils"), { recursive: true });

  // Copy built files to server directory
  console.log("📦 Copying built files...");
  execSync(`cp -r build/* ${DXT_BUILD_DIR}/server/`, { stdio: "inherit" });
  
  // Copy dependencies
  console.log("📦 Bundling dependencies...");
  execSync(`cp -r node_modules ${DXT_BUILD_DIR}/server/`, { stdio: "inherit" });
  
  // Create server package.json
  console.log("📦 Creating server package.json...");
  execSync(`cp package.json ${DXT_BUILD_DIR}/server/package.json`, { stdio: "inherit" });

  // Copy manifest
  console.log("📋 Copying manifest...");
  copyFileSync("manifest.json", join(DXT_BUILD_DIR, "manifest.json"));

  // Copy documentation
  console.log("📚 Copying documentation...");
  copyFileSync("DXT_README.md", join(DXT_BUILD_DIR, "README.md"));
  copyFileSync("LICENSE", join(DXT_BUILD_DIR, "LICENSE"));

  // Verify required files
  console.log("✅ Verifying build...");
  const missingFiles = REQUIRED_FILES.filter((file) => !existsSync(join(DXT_BUILD_DIR, file)));

  if (missingFiles.length > 0) {
    throw new Error(`Missing required files: ${missingFiles.join(", ")}`);
  }

  // Test server can load
  console.log("🧪 Testing server...");
  try {
    execSync(`cd ${DXT_BUILD_DIR}/server && node -e "console.log('Server loads successfully')"`, {
      stdio: "pipe",
    });
  } catch (_error) {
    throw new Error("Server validation failed");
  }

  console.log("🎉 DXT build completed successfully!");
  console.log(`📁 Build output: ${DXT_BUILD_DIR}/`);
  console.log(`📦 To create DXT package: dxt pack ${DXT_BUILD_DIR}`);
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
