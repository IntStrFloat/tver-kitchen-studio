# Blog Lead Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every blog article a measurable, contextual path to a Web3Forms lead while improving internal SEO structure.

**Architecture:** Extend the existing `BlogPost` records instead of migrating content. Add focused client components for article analytics and the lead form, then compose them in the current statically generated article page. Reuse the current Web3Forms helper and Yandex Metrika integration; add GA4 directly once in the root layout.

**Tech Stack:** Next.js 16, React 18, TypeScript, Tailwind CSS, Web3Forms, Yandex Metrika, Google Analytics 4.

---

## File structure

- Modify: `src/lib/data.ts` - article metadata and editorial FAQ/CTA data.
- Modify: `src/lib/analytics.ts` - provider-neutral blog event helper.
- Modify: `src/lib/seo.ts` - remove invalid `SearchAction`; add FAQ schema helper.
- Create: `src/components/BlogLeadForm.tsx` - contextual lead form and UTM collection.
- Create: `src/components/BlogFaq.tsx` - visible FAQ block.
- Create: `src/components/BlogRelatedPosts.tsx` - ordered related-content links.
- Create: `src/components/BlogAnalytics.tsx` - view and scroll event tracking.
- Modify: `src/app/(main)/blog/[slug]/page.tsx` - article composition and schema.
- Modify: `src/app/layout.tsx` - direct GA4 tag.
- Modify: `src/app/sitemap.ts` - use article modification date.

### Task 1: Extend article and analytics contracts

**Files:** `src/lib/data.ts`, `src/lib/analytics.ts`, `src/lib/seo.ts`

- [ ] Add `BlogFaqItem`, `BlogCta`, `BlogCluster`, `modifiedDate`, `cluster`, `relatedSlugs`, `faq`, and `cta` to every `BlogPost`.
- [ ] Define `BlogEventName` and `trackBlogEvent(name, payload)`; send non-PII payloads to `window.ym` and `window.gtag` when present.
- [ ] Remove `WebSite.potentialAction` because catalog search is absent.
- [ ] Add `generateFAQSchema(items)` returning `FAQPage` JSON-LD.
- [ ] Run `npm run typecheck`; expected result: exit code 0.
- [ ] Commit the contract change.

### Task 2: Build article conversion components

**Files:** `src/components/BlogLeadForm.tsx`, `src/components/BlogFaq.tsx`, `src/components/BlogRelatedPosts.tsx`, `src/components/BlogAnalytics.tsx`

- [ ] Implement `BlogLeadForm` with required name and phone, success/error states, privacy link, current URL UTM extraction, and Web3Forms details containing article title, URL, placement, and CTA context.
- [ ] Track `blog_cta_click` once on first form interaction, `blog_form_start` once on input focus, and `blog_lead` only after `sendLead` succeeds.
- [ ] Implement `BlogFaq` from visible data.
- [ ] Implement `BlogRelatedPosts` resolving ordered `relatedSlugs`, omitting missing records, and tracking clicks.
- [ ] Implement `BlogAnalytics` with one-time view and 50/75/90 scroll events; clean up listeners on unmount.
- [ ] Run `npm run typecheck`; expected result: exit code 0.
- [ ] Commit the component change.

### Task 3: Compose article pages and structured data

**Files:** `src/app/(main)/blog/[slug]/page.tsx`, `src/app/sitemap.ts`

- [ ] Split article rendering after the second H2 marker, or after two paragraphs when fewer headings exist.
- [ ] Render inline CTA, remaining content, FAQ, bottom CTA, related posts, and analytics in the approved order.
- [ ] Remove the article link to `/#quiz`.
- [ ] Use `modifiedDate` in `Article.dateModified` and sitemap `lastModified`.
- [ ] Emit FAQ schema only for visible non-empty FAQ data.
- [ ] Run `npm run typecheck`; expected result: exit code 0.
- [ ] Commit the page composition change.

### Task 4: Install GA4 and validate locally

**Files:** `src/app/layout.tsx`

- [ ] Add one async `gtag.js` script and one initialization script for `G-Z45D1032QK`; preserve the existing Metrika script.
- [ ] Verify no GA4 script is rendered from any nested route.
- [ ] Run `$env:NODE_OPTIONS='--max-old-space-size=512'; npx next build` in PowerShell; expected result: successful static generation.
- [ ] Open both new blog pages with UTM parameters, submit each form using a test phone number, and verify success/error UI plus Web3Forms payload.
- [ ] Commit the GA4 and verification-ready change.

### Task 5: Deploy and verify production

**Files:** no code changes.

- [ ] Push `main`.
- [ ] On the server, run `git pull --ff-only`, `npm ci --no-audit --no-fund`, `NODE_OPTIONS='--max-old-space-size=1536' npm run build`, and `systemctl restart tver-kitchen-studio`.
- [ ] Verify the service is active and the article URLs, `/sitemap.xml`, and `/robots.txt` return HTTP 200.
- [ ] Confirm in GA4 DebugView and Yandex Metrika that test events contain article metadata but no name or phone.
- [ ] Commit deployment notes only if a durable operational document changed.

## Verification constraints

The repository has no test runner and the approved scope forbids new dependencies. Type checking, production build, source inspection, browser flow, Web3Forms email, and provider debug views are mandatory. Adding unit/component-test tooling requires a separate dependency decision.
