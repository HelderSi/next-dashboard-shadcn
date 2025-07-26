#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

async function updatePnpm(targetVersion) {
  try {
    // Resolve version if 'latest' is specified
    if (targetVersion === "latest") {
      console.log("🔍 Fetching latest pnpm version...");
      targetVersion = execSync("npm show pnpm version").toString().trim();
    }

    console.log(`⬇️ Preparing pnpm@${targetVersion} with Corepack...`);
    execSync(`corepack prepare pnpm@${targetVersion}`, { stdio: "inherit" });

    console.log(`🔄 Updating packageManager field to pnpm@${targetVersion}...`);
    const packageJsonPath = "./package.json";
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    packageJson.packageManager = `pnpm@${targetVersion}`;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n"
    );

    console.log("✅ Successfully updated!");
    console.log("👉 Run `pnpm install` to apply changes with the new version");
  } catch (error) {
    console.error("❌ Update failed:", error.message);
    process.exit(1);
  }
}

// Get version argument (default: 'latest')
const targetVersion = process.argv[2] || "latest";
updatePnpm(targetVersion);
