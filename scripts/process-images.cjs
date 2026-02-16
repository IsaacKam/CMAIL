const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PROJECT_DIR = path.join(__dirname, "..");
const RAW_DIR = path.join(PROJECT_DIR, "public", "assets", "raw");
const MANIFEST_PATH = path.join(PROJECT_DIR, "public", "assets", "manifest.json");

const TIERS = [
  { name: "thumb", width: 256, quality: 80, dir: path.join(PROJECT_DIR, "public", "assets", "thumb") },
  { name: "mid", width: 800, quality: 80, dir: path.join(PROJECT_DIR, "public", "assets", "mid") },
  { name: "full", width: 1600, quality: 85, dir: path.join(PROJECT_DIR, "public", "assets", "full") },
];

const CONCURRENCY = 4;

async function processImage(entry) {
  const srcPath = path.join(RAW_DIR, entry.path);

  for (const tier of TIERS) {
    const outPath = path.join(tier.dir, `${entry.id}.webp`);
    if (fs.existsSync(outPath)) {
      entry[tier.name] = `assets/${tier.name}/${entry.id}.webp`;
      continue;
    }
    try {
      await sharp(srcPath)
        .resize({ width: tier.width, withoutEnlargement: true })
        .webp({ quality: tier.quality })
        .toFile(outPath);
      entry[tier.name] = `assets/${tier.name}/${entry.id}.webp`;
    } catch (err) {
      console.error(`Error processing ${entry.filename} @ ${tier.name}: ${err.message}`);
    }
  }
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const images = manifest.filter((a) => a.type === "image");

  for (const tier of TIERS) {
    fs.mkdirSync(tier.dir, { recursive: true });
  }

  console.log(`Processing ${images.length} images...`);

  // Process with limited concurrency
  for (let i = 0; i < images.length; i += CONCURRENCY) {
    const batch = images.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map((entry) => processImage(entry)));
    console.log(`  ${Math.min(i + CONCURRENCY, images.length)}/${images.length}`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log("Image processing complete. Manifest updated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
