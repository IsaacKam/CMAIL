#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Step 1: Extract assets ==="
bash "$SCRIPT_DIR/extract-assets.sh"

echo "=== Step 2: Generate manifest ==="
node "$SCRIPT_DIR/generate-manifest.cjs"

echo "=== Step 3: Process images ==="
node "$SCRIPT_DIR/process-images.cjs"

echo "=== Step 4: Process videos ==="
bash "$SCRIPT_DIR/process-videos.sh"

echo "=== Step 5: Generate atlas ==="
node "$SCRIPT_DIR/generate-atlas.cjs"

echo "=== Pipeline complete ==="
