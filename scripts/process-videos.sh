#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
MANIFEST="$PROJECT_DIR/public/assets/manifest.json"
RAW_DIR="$PROJECT_DIR/public/assets/raw"
THUMB_DIR="$PROJECT_DIR/public/assets/thumb"
VIDEO_DIR="$PROJECT_DIR/public/assets/video"

mkdir -p "$THUMB_DIR" "$VIDEO_DIR"

if ! command -v ffmpeg &>/dev/null; then
  echo "Warning: ffmpeg is not installed. Skipping video processing."
  exit 0
fi

# Write video entries to temp file first (avoids ffmpeg consuming stdin)
TMPFILE=$(mktemp)
node --input-type=commonjs -e "
const manifest = require('${MANIFEST}');
manifest.filter(a => a.type === 'video').forEach(a => {
  console.log(a.id + '|' + a.path);
});
" > "$TMPFILE"

while IFS='|' read -r id relpath; do
  filepath="$RAW_DIR/$relpath"
  echo "Processing video $id: $relpath"

  # Extract poster frame as PNG, then convert to WebP with sharp
  if [ ! -f "$THUMB_DIR/${id}.webp" ]; then
    ffmpeg -nostdin -y -i "$filepath" -vframes 1 -vf "scale=256:-2" "$THUMB_DIR/${id}.png" 2>/dev/null && \
    node --input-type=commonjs -e "
      require('sharp')('$THUMB_DIR/${id}.png')
        .webp({quality:80})
        .toFile('$THUMB_DIR/${id}.webp')
        .then(() => require('fs').unlinkSync('$THUMB_DIR/${id}.png'))
        .catch(e => { console.error(e); process.exit(1); })
    " 2>/dev/null || \
    echo "Warning: Could not extract poster for video $id"
  fi

  # Compress to 720p H.264 MP4
  if [ ! -f "$VIDEO_DIR/${id}.mp4" ]; then
    ffmpeg -nostdin -y -i "$filepath" \
      -vf "scale=-2:720" \
      -c:v libx264 -preset medium -crf 23 \
      -c:a aac -b:a 128k \
      -movflags +faststart \
      "$VIDEO_DIR/${id}.mp4" 2>/dev/null || \
      echo "Warning: Could not compress video $id"
  fi
done < "$TMPFILE"

rm -f "$TMPFILE"
echo "Video processing complete"
