#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Helpers for case conversions
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function camelize(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
function snakeCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[\s\-]+/g, "_");
}
function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

// Generate regex replacements
function generateReplacements(from, to) {
  return [
    { regex: new RegExp(from, "g"), replacement: to },
    {
      regex: new RegExp(from.toUpperCase(), "g"),
      replacement: to.toUpperCase(),
    },
    { regex: new RegExp(capitalize(from), "g"), replacement: capitalize(to) },
    { regex: new RegExp(camelize(from), "g"), replacement: camelize(to) },
    { regex: new RegExp(snakeCase(from), "g"), replacement: snakeCase(to) },
    { regex: new RegExp(kebabCase(from), "g"), replacement: kebabCase(to) },
  ];
}

function applyReplacements(str, replacements) {
  return replacements.reduce(
    (result, { regex, replacement }) => result.replace(regex, replacement),
    str
  );
}

function cloneFile(srcFile, destFile, replacements) {
  let content = fs.readFileSync(srcFile, "utf8");
  content = applyReplacements(content, replacements);
  fs.writeFileSync(destFile, content);
}

function cloneDirectory(srcDir, destDir, replacements) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  fs.readdirSync(srcDir).forEach((item) => {
    const srcPath = path.join(srcDir, item);
    const newName = applyReplacements(item, replacements);
    const destPath = path.join(destDir, newName);

    const stats = fs.statSync(srcPath);
    if (stats.isDirectory()) {
      cloneDirectory(srcPath, destPath, replacements);
    } else {
      cloneFile(srcPath, destPath, replacements);
    }
  });
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

// Parse arguments manually
function parseArgs() {
  const args = process.argv.slice(2);
  const options = { _: [] };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith("--")) {
        options[key] = value;
        i++;
      } else {
        options[key] = true;
      }
    } else {
      options._.push(arg);
    }
  }
  return options;
}

async function main() {
  const args = parseArgs();

  const inputPath = args._[0];
  if (!inputPath) {
    console.error(
      "❌ Usage: node cloneAndReplace.js <sourcePath> --from <fromName> --to <toName> [--dest <destinationPath>]"
    );
    process.exit(1);
  }

  const absolutePath = path.resolve(inputPath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Path does not exist: ${absolutePath}`);
    process.exit(1);
  }

  const fromName =
    args.from ||
    (await askQuestion(
      "🔤 What is the base name to replace (e.g. 'customer')? "
    ));
  const toName =
    args.to ||
    (await askQuestion("🔁 What is the new name to use (e.g. 'product')? "));
  const replacements = generateReplacements(fromName, toName);

  const stats = fs.statSync(absolutePath);
  const baseName = path.basename(absolutePath);
  const newBaseName = applyReplacements(baseName, replacements);
  const parentDir = path.dirname(absolutePath);

  const destPath = args.dest
    ? path.resolve(args.dest)
    : stats.isDirectory()
    ? path.join(parentDir, newBaseName)
    : path.join(parentDir, newBaseName);

  if (stats.isDirectory()) {
    cloneDirectory(absolutePath, destPath, replacements);
  } else {
    const fileName = path.basename(absolutePath);
    const newFileName = applyReplacements(fileName, replacements);
    const newFilePath = path.join(destPath, newFileName);

    fs.mkdirSync(destPath, { recursive: true });
    cloneFile(absolutePath, newFilePath, replacements);
  }

  console.log(`✅ Cloned to: ${destPath}`);
}

main();
