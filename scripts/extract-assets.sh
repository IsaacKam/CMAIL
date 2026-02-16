#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
RAW_DIR="$PROJECT_DIR/public/assets/raw"

rm -rf "$RAW_DIR"
mkdir -p "$RAW_DIR"

# Unzip, skip __MACOSX metadata
unzip -o "$PROJECT_DIR/Portfolio.zip" -d "$RAW_DIR" -x "__MACOSX/*" "*.DS_Store"

echo "Extraction complete: $RAW_DIR"
