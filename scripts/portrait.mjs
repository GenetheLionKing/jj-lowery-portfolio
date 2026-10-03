import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
// Next already depends on Sharp; this adds no application or build dependency.
const sharp = require(
  require.resolve("sharp", {
    paths: [path.dirname(require.resolve("next/package.json"))],
  }),
);
const source = "public/images/profile_smile.jpg";

for (const width of [320, 640, 960]) {
  await sharp(source)
    .resize(width, width)
    .webp({ quality: 78, effort: 5 })
    .toFile(`public/images/profile-${width}.webp`);
  await sharp(source)
    .resize(width, width)
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(`public/images/profile-${width}.jpg`);
}
console.log(
  "Built responsive portrait derivatives; original source preserved.",
);
