/**
 * Completed projects are separate from the design references in data.ts.
 * Add a record only after the owner supplies actual photos, cost scope and
 * publication permission. Use city/district only, without customer addresses.
 * Approval references stay in source, never in HTML or client-component props.
 */
export interface PortfolioCase {
  slug: string;
  title: string;
  city: string;
  styleSlug: string;
  task: string;
  dimensions: string;
  constraints: string[];
  solution: string;
  materials: string[];
  hardware: string[];
  cost: {
    totalRub: number;
    calculatedAt: string;
    includes: string[];
    excludes: string[];
  };
  timing: { description: string; completedAt: string };
  photos: {
    src: string;
    alt: string;
    width: number;
    height: number;
    kind: "completed-project" | "reference";
  }[];
  author: string;
  conclusion: string;
  publishedAt: string;
  updatedAt: string;
  evidence: {
    confirmedBy: string;
    confirmedAt: string;
    sourceReference: string;
    photosMayBePublished: boolean;
  };
}

// No completed-project materials have been supplied yet. Do not fill this
// array with the reference images or example quotes from the former price page.
export const portfolioCases: PortfolioCase[] = [];

function isPastDate(value: string, today: Date): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value && date <= today;
}

export function getPublicationErrors(project: PortfolioCase, today = new Date()): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) errors.push("Некорректный slug проекта.");
  if ([project.title, project.city, project.styleSlug, project.task, project.dimensions, project.solution, project.author, project.conclusion].some((value) => !value.trim())) {
    errors.push("Не заполнены факты и описание проекта.");
  }
  if (![project.materials, project.hardware, project.constraints].every((items) => items.length > 0 && items.every((item) => item.trim()))) {
    errors.push("Не описаны материалы, фурнитура или ограничения.");
  }
  if (!Number.isFinite(project.cost.totalRub) || project.cost.totalRub <= 0 || !isPastDate(project.cost.calculatedAt, today) || !project.cost.includes.length || !project.cost.excludes.length || ![...project.cost.includes, ...project.cost.excludes].every((item) => item.trim())) {
    errors.push("Не подтверждены стоимость, её дата и состав.");
  }
  if (!project.timing.description.trim() || !isPastDate(project.timing.completedAt, today)) errors.push("Не описаны фактические сроки.");
  if (!project.photos.length || project.photos.some((photo) => photo.kind !== "completed-project" || !/^\/images\/projects\/[a-z0-9/_-]+\.(?:jpe?g|png|webp|avif)$/i.test(photo.src) || !photo.alt.trim() || !Number.isFinite(photo.width) || !Number.isFinite(photo.height) || photo.width <= 0 || photo.height <= 0)) {
    errors.push("Нужны реальные фотографии проекта с размерами и описанием.");
  }
  if (!project.evidence.photosMayBePublished || !project.evidence.confirmedBy.trim() || !project.evidence.sourceReference.trim() || !isPastDate(project.evidence.confirmedAt, today)) {
    errors.push("Нет подтверждения владельца и разрешения на фотографии.");
  }
  if (!isPastDate(project.publishedAt, today) || !isPastDate(project.updatedAt, today) || project.updatedAt < project.publishedAt || project.publishedAt < project.timing.completedAt || project.updatedAt < project.evidence.confirmedAt || project.evidence.confirmedAt < project.timing.completedAt || project.evidence.confirmedAt < project.cost.calculatedAt) {
    errors.push("Некорректны редакционные даты публикации.");
  }
  return errors;
}

export function getPublishedPortfolioCases(entries = portfolioCases, today = new Date()): PortfolioCase[] {
  const slugCounts = new Map<string, number>();
  entries.forEach((project) => slugCounts.set(project.slug, (slugCounts.get(project.slug) ?? 0) + 1));
  return entries.filter((project) => slugCounts.get(project.slug) === 1 && getPublicationErrors(project, today).length === 0);
}

export function getPortfolioCase(slug: string): PortfolioCase | undefined {
  return getPublishedPortfolioCases().find((project) => project.slug === slug);
}
