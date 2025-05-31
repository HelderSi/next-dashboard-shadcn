#!/bin/bash

# Exit script on error
set -e

# Helper to print usage
usage() {
  echo "Usage: $0 --from <fromName> --to <toName> --replaces \"old1:new1,old2:new2,...\""
  exit 1
}

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --from) FROM="$2"; shift ;;
    --to) TO="$2"; shift ;;
    --replaces) REPLACES="$2"; shift ;;
    *) echo "❌ Unknown parameter passed: $1"; usage ;;
  esac
  shift
done

# Validate required params
if [[ -z "$FROM" || -z "$TO" ]]; then
  echo "❌ --from and --to are required."
  usage
fi

echo "📁 Cloning and replacing from '$FROM' to '$TO'..."

# Clone and replace blocks
node scripts/cloneAndReplace.js "./src/app/(dashboard)/${FROM}s" --from "$FROM" --to "$TO" --dest "./src/app/(dashboard)/${TO}s"
node scripts/cloneAndReplace.js "src/models/$(tr '[:lower:]' '[:upper:]' <<< ${FROM:0:1})${FROM:1}.ts" --from "$FROM" --to "$TO" --dest "src/models/"
node scripts/cloneAndReplace.js "src/lib/db/${FROM}s.ts" --from "$FROM" --to "$TO" --dest "src/lib/db/"
node scripts/cloneAndReplace.js "src/app/api/${FROM}s" --from "$FROM" --to "$TO" --dest "src/app/api/${TO}s"

# Run custom text replacements if provided
if [[ -n "$REPLACES" ]]; then
  IFS=',' read -ra PAIRS <<< "$REPLACES"
  for pair in "${PAIRS[@]}"; do
    IFS=':' read -ra KV <<< "$pair"
    OLD="${KV[0]}"
    NEW="${KV[1]}"
    echo "🔁 Replacing text '$OLD' -> '$NEW' in './src/app/(dashboard)/${TO}s'"
    node scripts/replace.js "./src/app/(dashboard)/${TO}s" --from "$OLD" --to "$NEW"
  done
fi

echo "✅ Module '$TO' created successfully based on '$FROM'."
