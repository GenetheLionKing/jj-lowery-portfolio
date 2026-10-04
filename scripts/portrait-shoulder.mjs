import { createRequire } from "node:module";
import path from "node:path";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", {
    paths: [path.dirname(require.resolve("next/package.json"))],
  }),
);
// Approved Library version 2: original head pixels, expanded shoulder contours,
// real alpha. Keep the complete canvas and its aspect ratio in every derivative.
const input = await readFile("assets/portrait-shoulder-approved.png");
if (
  createHash("sha256").update(input).digest("hex") !==
  "efece57a797797c1229d196e8eb651d2b3ffd4515e93f61d6882538484abb083"
) {
  throw new Error("Portrait must match the approved version 2 source");
}
const metadata = await sharp(input).metadata();
if (metadata.width !== 1640 || metadata.height !== 1294 || !metadata.hasAlpha) {
  throw new Error("Expected the full approved 1640×1294 RGBA canvas");
}
for (const width of [320, 640, 960, 1280]) {
  await sharp(input)
    .resize({ width })
    .webp({ quality: 82, effort: 5 })
    .toFile(`public/images/profile-shoulder-${width}.webp`);
  await sharp(input)
    .resize({ width })
    .png({ compressionLevel: 9 })
    .toFile(`public/images/profile-shoulder-${width}.png`);
}
console.log("Built complete, transparent shoulder portraits without cropping.");
