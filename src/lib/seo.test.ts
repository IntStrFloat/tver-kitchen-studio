import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runtime requires the explicit extension.
import { formatTitleWithBrand } from "./seo.ts";

test("adds the brand to an unbranded SEO title", () => {
  assert.equal(
    formatTitleWithBrand("Кварц или мрамор для столешницы кухни — сравнение"),
    "Кварц или мрамор для столешницы кухни — сравнение | Kuhnitver",
  );
});

test("does not duplicate an existing brand suffix", () => {
  assert.equal(
    formatTitleWithBrand(
      "Кварц или мрамор для столешницы кухни — сравнение | Kuhnitver",
    ),
    "Кварц или мрамор для столешницы кухни — сравнение | Kuhnitver",
  );
});
