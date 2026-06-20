import { existsSync, readFileSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

const APPROVED_GROUPS = new Set(["kitchens", "wardrobes", "walk-in", "other"]);
const MINIMUM_RECORDS = 30;

function fail(message) {
  throw new Error(message);
}

function requireArray(dataset, key) {
  if (!Array.isArray(dataset[key])) fail(`Dataset field must be an array: ${key}`);
  return dataset[key];
}

function collectIds(records, type) {
  const ids = new Set();
  for (const record of records) {
    if (!record || typeof record.id !== "string" || !record.id) fail(`${type} has an invalid id`);
    if (ids.has(record.id)) fail(`Duplicate ${type.toLowerCase()} id: ${record.id}`);
    ids.add(record.id);
  }
  return ids;
}

function requirePrivateFile(manifestDirectory, relativePath) {
  if (typeof relativePath !== "string" || !relativePath.startsWith("private/") || isAbsolute(relativePath)) {
    fail(`File must be a private relative path: ${relativePath}`);
  }
  const privateDirectory = resolve(manifestDirectory, "private");
  const filePath = resolve(manifestDirectory, relativePath);
  const pathFromPrivateDirectory = relative(privateDirectory, filePath);
  if (
    pathFromPrivateDirectory === ".." ||
    pathFromPrivateDirectory.startsWith(`..${sep}`) ||
    isAbsolute(pathFromPrivateDirectory)
  ) fail(`File must be a private relative path: ${relativePath}`);
  if (!existsSync(filePath)) fail(`Missing file: ${relativePath}`);
  const realPrivateDirectory = realpathSync(privateDirectory);
  const realFilePath = realpathSync(filePath);
  const realPathFromPrivateDirectory = relative(realPrivateDirectory, realFilePath);
  if (
    realPathFromPrivateDirectory === ".." ||
    realPathFromPrivateDirectory.startsWith(`..${sep}`) ||
    isAbsolute(realPathFromPrivateDirectory)
  ) fail(`File must resolve inside the private directory: ${relativePath}`);
}

function validateDataset(dataset, manifestDirectory) {
  if (!dataset || typeof dataset !== "object" || Array.isArray(dataset)) fail("Dataset must be a JSON object");
  const products = requireArray(dataset, "products");
  const rooms = requireArray(dataset, "rooms");
  const cases = requireArray(dataset, "cases");
  if (products.length < MINIMUM_RECORDS) fail(`At least ${MINIMUM_RECORDS} products are required`);
  if (rooms.length < MINIMUM_RECORDS) fail(`At least ${MINIMUM_RECORDS} rooms are required`);
  if (cases.length < MINIMUM_RECORDS) fail(`At least ${MINIMUM_RECORDS} cases are required`);

  const productIds = collectIds(products, "Product");
  const roomIds = collectIds(rooms, "Room");
  collectIds(cases, "Case");

  for (const product of products) {
    if (!APPROVED_GROUPS.has(product.group)) fail(`Product ${product.id} has an unsupported group: ${product.group}`);
    if (!Array.isArray(product.references) || product.references.length < 2) {
      fail(`Product ${product.id} requires at least 2 references`);
    }
    for (const reference of product.references) requirePrivateFile(manifestDirectory, reference);
  }
  for (const room of rooms) {
    requirePrivateFile(manifestDirectory, room.image);
    requirePrivateFile(manifestDirectory, room.mask);
  }
  const coveredProducts = new Set();
  const coveredRooms = new Set();
  for (const item of cases) {
    if (!productIds.has(item.productId)) fail(`Case ${item.id} references unknown product: ${item.productId}`);
    if (!roomIds.has(item.roomId)) fail(`Case ${item.id} references unknown room: ${item.roomId}`);
    coveredProducts.add(item.productId);
    coveredRooms.add(item.roomId);
  }
  for (const productId of productIds) {
    if (!coveredProducts.has(productId)) fail(`Product ${productId} is not covered by a case`);
  }
  for (const roomId of roomIds) {
    if (!coveredRooms.has(roomId)) fail(`Room ${roomId} is not covered by a case`);
  }
  return { products: products.length, rooms: rooms.length, cases: cases.length };
}

function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) fail("Usage: node scripts/try-on/validate-dataset.mjs <dataset.json>");
  const dataset = JSON.parse(readFileSync(manifestPath, "utf8"));
  const summary = validateDataset(dataset, dirname(resolve(manifestPath)));
  console.log(`Dataset is valid: ${summary.products} products, ${summary.rooms} rooms, ${summary.cases} cases`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
