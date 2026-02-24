/**
 * One-time migration script — uploads existing local images to Cloudinary.
 *
 * Run from the tc-photography project root:
 *   node --env-file .env.local scripts/migrate-to-cloudinary.mjs
 */

import { v2 as cloudinary } from 'cloudinary';
import { readdir } from 'fs/promises';
import { join, basename } from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const OPTIMIZED_DIR = './public/optimized';

// Maps local top-level folder → Cloudinary folder name
// Birds subcategories (ducks, flight, small) all go into tc-photography/birds
const FOLDER_MAP = {
  coast:     'tc-photography/coast',
  landscape: 'tc-photography/landscape',
  wildlife:  'tc-photography/wildlife',
  birds:     'tc-photography/birds',
  insects:   'tc-photography/insects',
  river:     'tc-photography/river',
};

// Recursively collect all image files under a directory
async function collectImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectImages(full));
    } else if (/\.(webp|jpg|jpeg|png)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function upload(filePath, cloudinaryFolder) {
  const name = basename(filePath, filePath.slice(filePath.lastIndexOf('.')));
  return cloudinary.uploader.upload(filePath, {
    folder: cloudinaryFolder,
    public_id: name,
    overwrite: false, // skip if already uploaded
    resource_type: 'image',
  });
}

async function main() {
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const [localFolder, cloudFolder] of Object.entries(FOLDER_MAP)) {
    const dir = join(OPTIMIZED_DIR, localFolder);
    let files;
    try {
      files = await collectImages(dir);
    } catch {
      console.warn(`⚠️  Skipping ${localFolder} — folder not found`);
      continue;
    }

    console.log(`\n📁 ${localFolder} (${files.length} images) → ${cloudFolder}`);

    for (const file of files) {
      try {
        const result = await upload(file, cloudFolder);
        if (result.existing) {
          console.log(`  ⏭  skipped (already exists): ${basename(file)}`);
          skipped++;
        } else {
          console.log(`  ✅ uploaded: ${basename(file)}`);
          uploaded++;
        }
      } catch (err) {
        console.error(`  ❌ failed: ${basename(file)} — ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\n✨ Done — ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
}

main();
