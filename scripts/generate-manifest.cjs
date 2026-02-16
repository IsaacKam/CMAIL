const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const RAW_DIR = path.join(__dirname, "..", "public", "assets", "raw");
const MANIFEST_PATH = path.join(__dirname, "..", "public", "assets", "manifest.json");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".tiff"]);
const VIDEO_EXTS = new Set([".mp4", ".mov", ".avi", ".mkv"]);

function walkDir(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, results);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTS.has(ext) || VIDEO_EXTS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function main() {
  const files = walkDir(RAW_DIR).sort();
  const manifest = [];

  for (let i = 0; i < files.length; i++) {
    const fullPath = files[i];
    const relPath = path.relative(RAW_DIR, fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    const isImage = IMAGE_EXTS.has(ext);
    // Portfolio.zip extracts to raw/Portfolio/<Project>/... so project is at index 1
    const parts = relPath.split(path.sep);
    const project = parts.length > 1 ? parts[1] : parts[0] || "Unknown";

    const entry = {
      id: i,
      filename: path.basename(fullPath),
      path: relPath,
      type: isImage ? "image" : "video",
      project,
      width: null,
      height: null,
    };

    if (isImage) {
      try {
        const meta = await sharp(fullPath).metadata();
        entry.width = meta.width;
        entry.height = meta.height;
      } catch (err) {
        console.warn(`Warning: could not read metadata for ${relPath}: ${err.message}`);
      }
    }

    manifest.push(entry);
  }

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Manifest generated: ${manifest.length} assets (${manifest.filter(a => a.type === "image").length} images, ${manifest.filter(a => a.type === "video").length} videos)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
