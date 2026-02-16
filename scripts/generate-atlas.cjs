const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PROJECT_DIR = path.join(__dirname, "..");
const MANIFEST_PATH = path.join(PROJECT_DIR, "public", "assets", "manifest.json");
const THUMB_DIR = path.join(PROJECT_DIR, "public", "assets", "thumb");
const ATLAS_PATH = path.join(PROJECT_DIR, "public", "assets", "atlas.webp");
const ATLAS_MAP_PATH = path.join(PROJECT_DIR, "public", "assets", "atlas-map.json");

const ATLAS_SIZE = 4096;
const CELL_W = 256;
const CELL_H = 192;
const COLS = Math.floor(ATLAS_SIZE / CELL_W); // 16
const ROWS = Math.floor(ATLAS_SIZE / CELL_H); // 21

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const maxSlots = COLS * ROWS;

  // Collect entries that have a thumb
  const entries = manifest.filter((a) => {
    const thumbPath = path.join(THUMB_DIR, `${a.id}.webp`);
    return fs.existsSync(thumbPath);
  });

  if (entries.length > maxSlots) {
    console.warn(`Warning: ${entries.length} thumbs but only ${maxSlots} atlas slots. Truncating.`);
    entries.length = maxSlots;
  }

  console.log(`Packing ${entries.length} thumbs into ${ATLAS_SIZE}x${ATLAS_SIZE} atlas (${COLS}x${ROWS} grid)`);

  // Prepare composites
  const composites = [];
  const atlasMap = {};

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = col * CELL_W;
    const y = row * CELL_H;

    const thumbPath = path.join(THUMB_DIR, `${entry.id}.webp`);

    // Resize thumb to fit within cell (contain)
    const resized = await sharp(thumbPath)
      .resize({ width: CELL_W, height: CELL_H, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 255 } })
      .flatten({ background: { r: 0, g: 0, b: 0 } })
      .toBuffer();

    composites.push({ input: resized, left: x, top: y });

    atlasMap[entry.id] = {
      u: x / ATLAS_SIZE,
      v: y / ATLAS_SIZE,
      w: CELL_W / ATLAS_SIZE,
      h: CELL_H / ATLAS_SIZE,
    };
  }

  // Create atlas
  await sharp({
    create: {
      width: ATLAS_SIZE,
      height: ATLAS_SIZE,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite(composites)
    .webp({ quality: 80 })
    .toFile(ATLAS_PATH);

  fs.writeFileSync(ATLAS_MAP_PATH, JSON.stringify(atlasMap, null, 2));
  console.log(`Atlas saved: ${ATLAS_PATH}`);
  console.log(`Atlas map saved: ${ATLAS_MAP_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
