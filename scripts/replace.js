#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Case utilities
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

// Replacement rules
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

// Replace inside one file
function replaceInFile(filePath, replacements) {
  const content = fs.readFileSync(filePath, "utf8");
  const newContent = applyReplacements(content, replacements);
  fs.writeFileSync(filePath, newContent, "utf8");
}

// Recursively replace in all files in directory
function replaceInDirectory(dirPath, replacements) {
  const entries = fs.readdirSync(dirPath);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      replaceInDirectory(fullPath, replacements);
    } else {
      replaceInFile(fullPath, replacements);
    }
  }
}

// CLI helper
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

// CLI args parser
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

  const targetPath = args._[0];
  if (!targetPath) {
    console.error(
      "❌ Usage: node replace.js <fileOrDir> --from <from> --to <to>"
    );
    process.exit(1);
  }

  const absolutePath = path.resolve(targetPath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Path does not exist: ${absolutePath}`);
    process.exit(1);
  }

  const fromName =
    args.from ||
    (await askQuestion(
      "🔤 What is the base name to replace (e.g. customer)? "
    ));
  const toName =
    args.to ||
    (await askQuestion("🔁 What is the new name to use (e.g. client)? "));

  const replacements = generateReplacements(fromName, toName);

  const stats = fs.statSync(absolutePath);
  if (stats.isDirectory()) {
    replaceInDirectory(absolutePath, replacements);
  } else {
    replaceInFile(absolutePath, replacements);
  }

  console.log(`✅ Replacement complete in: ${absolutePath}`);
}

main();
