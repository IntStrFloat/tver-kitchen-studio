import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

const svgBuffer = fs.readFileSync(svgPath);

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generatePNGs() {
  for (const { name, size } of sizes) {
    await sharp(svgBuffer, { density: Math.max(300, size * 10) })
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name} (${size}x${size})`);
  }
}

function createICO(pngBuffers) {
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  const dataOffset = headerSize + entrySize * numImages;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // ICO type
  header.writeUInt16LE(numImages, 4);

  const entries = [];
  const imageDatas = [];
  let currentOffset = dataOffset;

  for (const { buffer, size } of pngBuffers) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(size < 256 ? size : 0, 0);   // width
    entry.writeUInt8(size < 256 ? size : 0, 1);   // height
    entry.writeUInt8(0, 2);                         // color palette
    entry.writeUInt8(0, 3);                         // reserved
    entry.writeUInt16LE(1, 4);                      // color planes
    entry.writeUInt16LE(32, 6);                     // bits per pixel
    entry.writeUInt32LE(buffer.length, 8);          // image data size
    entry.writeUInt32LE(currentOffset, 12);         // offset to image data

    entries.push(entry);
    imageDatas.push(buffer);
    currentOffset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...imageDatas]);
}

async function generateICO() {
  const icoSizes = [16, 32, 48];
  const pngBuffers = [];

  for (const size of icoSizes) {
    const buffer = await sharp(svgBuffer, { density: size * 10 })
      .resize(size, size)
      .png()
      .toBuffer();
    pngBuffers.push({ buffer, size });
  }

  const icoBuffer = createICO(pngBuffers);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log(`Generated favicon.ico (${icoSizes.join(', ')}px, ${icoBuffer.length} bytes)`);
}

async function main() {
  console.log('Generating favicons from SVG...\n');
  await generatePNGs();
  await generateICO();
  console.log('\nDone!');
}

main().catch(console.error);
