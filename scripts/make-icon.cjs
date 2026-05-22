const fs = require('fs');
const path = require('path');
const pngToIcoModule = require('png-to-ico');
const sharp = require('sharp');

const pngToIco = pngToIcoModule.default || pngToIcoModule;

const rootDir = path.join(__dirname, '..');
const source = path.join(rootDir, 'public', 'assets', 'icon.png');
const output = path.join(rootDir, 'public', 'assets', 'icon.ico');
const tempDir = path.join(rootDir, 'node_modules', '.cache', 'atari-portal-icons');
const sizes = [16, 24, 32, 48, 64, 128, 256];

async function main() {
  if (!fs.existsSync(source)) {
    throw new Error(`Icon source not found: ${source}`);
  }

  await fs.promises.mkdir(tempDir, { recursive: true });

  const pngFiles = await Promise.all(
    sizes.map(async (size) => {
      const file = path.join(tempDir, `icon-${size}.png`);
      await sharp(source)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
        })
        .png()
        .toFile(file);
      return file;
    }),
  );

  const ico = await pngToIco(pngFiles);
  await fs.promises.writeFile(output, ico);
  console.log(`Wrote ${path.relative(rootDir, output)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
