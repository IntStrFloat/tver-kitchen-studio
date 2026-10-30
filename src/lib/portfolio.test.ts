import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runtime requires the explicit extension.
import { getPublishedPortfolioCases, getPublicationErrors, type PortfolioCase } from "./portfolio.ts";

const today = new Date("2026-10-30T12:00:00Z");

function completedCase(): PortfolioCase {
  return {
    slug: "test-approved-kitchen",
    title: "Тестовый проект для проверки публикации",
    city: "Тверь",
    styleSlug: "loft",
    task: "Сохранить проход при заданных размерах помещения.",
    dimensions: "Тестовые размеры 3 × 2 м",
    constraints: ["Учитывалось расположение вентиляции."],
    solution: "Угловая компоновка с отдельной зоной хранения.",
    materials: ["Тестовый материал фасадов"],
    hardware: ["Тестовая фурнитура"],
    cost: {
      totalRub: 100000,
      calculatedAt: "2026-10-01",
      includes: ["Мебель по спецификации"],
      excludes: ["Бытовая техника"],
    },
    timing: { description: "Фактические этапы согласованы в тестовом отчёте.", completedAt: "2026-10-15" },
    photos: [{ src: "/images/projects/test-approved-kitchen/front.jpg", alt: "Общий вид тестового проекта", width: 1200, height: 800, kind: "completed-project" }],
    author: "Редакция Kuhnitver",
    conclusion: "Решение сохранило доступ к коммуникациям.",
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-20",
    evidence: {
      confirmedBy: "Ответственный за тестовую запись",
      confirmedAt: "2026-10-19",
      sourceReference: "Тестовая карточка проекта; не публикуется",
      photosMayBePublished: true,
    },
  };
}

test("only complete confirmed real-project records can be published", () => {
  assert.deepEqual(getPublicationErrors(completedCase(), today), []);
  assert.equal(getPublishedPortfolioCases([completedCase()], today).length, 1);
});

test("a design reference cannot be passed off as a completed project photo", () => {
  const project = completedCase();
  project.photos[0].kind = "reference";
  assert.match(getPublicationErrors(project, today).join(" "), /фотограф/);
  project.photos[0].kind = "completed-project";
  project.photos[0].src = "/images/kitchen-loft.jpg";
  assert.equal(getPublishedPortfolioCases([project], today).length, 0);
});

test("missing approval or rights prevents publication", () => {
  const project = completedCase();
  project.evidence.photosMayBePublished = false;
  project.evidence.confirmedBy = "";
  assert.equal(getPublishedPortfolioCases([project], today).length, 0);
});

test("missing actual cost scope and future dates prevent publication", () => {
  const project = completedCase();
  project.cost.totalRub = 0;
  project.cost.includes = [];
  project.publishedAt = "2026-11-15";
  assert.equal(getPublishedPortfolioCases([project], today).length, 0);
});

test("duplicate slugs cannot produce ambiguous public project URLs", () => {
  assert.equal(getPublishedPortfolioCases([completedCase(), completedCase()], today).length, 0);
});

test("photos must have finite usable dimensions", () => {
  const project = completedCase();
  project.photos[0].width = Number.NaN;
  assert.equal(getPublishedPortfolioCases([project], today).length, 0);
});

test("confirmation must cover the actual completed project and dated estimate", () => {
  const project = completedCase();
  project.evidence.confirmedAt = "2026-10-01";
  assert.equal(getPublishedPortfolioCases([project], today).length, 0);
});
