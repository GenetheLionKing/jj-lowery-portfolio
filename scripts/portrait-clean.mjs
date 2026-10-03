import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", {
    paths: [path.dirname(require.resolve("next/package.json"))],
  }),
);
// The AI output supplies a silhouette matte only. RGB comes from the original
// owner photograph, so facial pixels are not regenerated or retouched.
const original = "public/images/profile_smile.jpg";
const matte = await sharp("assets/portrait-matte.png")
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
const source = await sharp(original)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
if (
  source.info.width !== matte.info.width ||
  source.info.height !== matte.info.height
)
  throw new Error("Matte must match original dimensions");
const rgba = await sharp(source.data, { raw: source.info })
  .joinChannel(matte.data, { raw: matte.info })
  .png()
  .toBuffer();
for (const width of [320, 640, 960]) {
  await sharp(rgba)
    .resize(width, width)
    .webp({ quality: 80, effort: 5 })
    .toFile(`public/images/profile-clean-${width}.webp`);
  await sharp(rgba)
    .resize(width, width)
    .png({ compressionLevel: 9, palette: true, quality: 95 })
    .toFile(`public/images/profile-clean-${width}.png`);
}
for (const [name, input] of [
  ["vector-income", "assets/vector-envelopes.webp"],
  ["vector-validation", "assets/vector-validation.png"],
]) {
  await sharp(input)
    .resize(640, 480, { fit: "contain", background: "#060b12" })
    .webp({ quality: 80, effort: 5 })
    .toFile(`public/images/work/${name}.webp`);
}
console.log(
  "Portfolio thumbnail comes from the actual local rendered homepage.",
);
await sharp("assets/portfolio-home.png")
  .resize(640, 480, { fit: "contain", background: "#f4f5f7" })
  .webp({ quality: 82, effort: 5 })
  .toFile("public/images/work/portfolio.webp");
console.log(
  "Built clean responsive portraits and original Vector work thumbnails.",
);
