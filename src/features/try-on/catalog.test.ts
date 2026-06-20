import assert from "node:assert/strict";
import test from "node:test";

import { TRY_ON_GROUPS, TRY_ON_PRODUCTS } from "./catalog.ts";

test("try-on groups keep their stable order", () => {
  assert.deepEqual(
    TRY_ON_GROUPS.map(({ id }) => id),
    ["kitchens", "wardrobes", "walk-in", "other"],
  );
});

test("try-on product ids are unique", () => {
  const productIds = TRY_ON_PRODUCTS.map(({ id }) => id);

  assert.equal(new Set(productIds).size, productIds.length);
});

test("every try-on product belongs to a known group", () => {
  const groupIds = new Set(TRY_ON_GROUPS.map(({ id }) => id));

  for (const product of TRY_ON_PRODUCTS) {
    assert.ok(groupIds.has(product.groupId));
  }
});

test("every try-on product has two to four references", () => {
  for (const product of TRY_ON_PRODUCTS) {
    assert.ok(product.references.length >= 2);
    assert.ok(product.references.length <= 4);
  }
});
