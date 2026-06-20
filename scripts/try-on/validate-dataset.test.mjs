import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("./validate-dataset.mjs", import.meta.url));
const groups = ["kitchens", "wardrobes", "walk-in", "other"];

function createFixture(mutator = (dataset) => dataset) {
  const directory = mkdtempSync(join(tmpdir(), "try-on-dataset-"));
  const products = Array.from({ length: 30 }, (_, index) => ({
    id: `product-${String(index + 1).padStart(3, "0")}`,
    group: groups[index % groups.length],
    references: [
      `private/products/product-${String(index + 1).padStart(3, "0")}-01.webp`,
      `private/products/product-${String(index + 1).padStart(3, "0")}-02.webp`,
    ],
  }));
  const rooms = Array.from({ length: 30 }, (_, index) => ({
    id: `room-${String(index + 1).padStart(3, "0")}`,
    image: `private/rooms/room-${String(index + 1).padStart(3, "0")}.webp`,
    mask: `private/masks/room-${String(index + 1).padStart(3, "0")}.png`,
  }));
  const dataset = mutator({
    products: products.map((product) => ({ ...product, references: [...product.references] })),
    rooms: rooms.map((room) => ({ ...room })),
    cases: products.map((product, index) => ({
      id: `case-${String(index + 1).padStart(3, "0")}`,
      productId: product.id,
      roomId: rooms[index].id,
    })),
  });

  function createFile(relativePath, contents) {
    const path = join(directory, relativePath);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, contents);
  }
  for (const product of products) {
    for (const reference of product.references) createFile(reference, "image");
  }
  for (const room of rooms) {
    createFile(room.image, "image");
    createFile(room.mask, "mask");
  }
  const manifest = join(directory, "dataset.json");
  writeFileSync(manifest, JSON.stringify(dataset));
  return { directory, manifest };
}

function validate(manifest) {
  return execFileSync(process.execPath, [script, manifest], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function assertFailure(mutator, message) {
  const fixture = createFixture(mutator);
  try {
    assert.throws(() => validate(fixture.manifest), (error) => {
      assert.match(error.stderr, message);
      return true;
    });
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
}

test("accepts a complete benchmark dataset", () => {
  const fixture = createFixture();
  try {
    assert.match(validate(fixture.manifest), /Dataset is valid: 30 products, 30 rooms, 30 cases/);
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});

test("rejects duplicate product ids", () => {
  assertFailure((dataset) => {
    dataset.products[1].id = dataset.products[0].id;
    return dataset;
  }, /Duplicate product id: product-001/);
});

test("rejects missing image files", () => {
  assertFailure((dataset) => {
    dataset.products[0].references[0] = "private/products/missing.webp";
    return dataset;
  }, /Missing file: private\/products\/missing\.webp/);
});

test("requires at least 30 products", () => {
  assertFailure((dataset) => {
    dataset.products.pop();
    return dataset;
  }, /At least 30 products are required/);
});

test("requires at least 30 rooms", () => {
  assertFailure((dataset) => {
    dataset.rooms.pop();
    return dataset;
  }, /At least 30 rooms are required/);
});

test("requires at least two product references", () => {
  assertFailure((dataset) => {
    dataset.products[0].references.pop();
    return dataset;
  }, /Product product-001 requires at least 2 references/);
});

test("rejects case links to unknown records", () => {
  assertFailure((dataset) => {
    dataset.cases[0].roomId = "room-missing";
    return dataset;
  }, /Case case-001 references unknown room: room-missing/);
});

test("rejects groups outside the approved four", () => {
  assertFailure((dataset) => {
    dataset.products[0].group = "chairs";
    return dataset;
  }, /Product product-001 has an unsupported group: chairs/);
});
