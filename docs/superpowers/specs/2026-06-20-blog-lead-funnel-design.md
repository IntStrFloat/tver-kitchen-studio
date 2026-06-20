# Blog lead funnel design

## Purpose

Turn the blog into a measurable acquisition channel for kitchen buyers in Tver and the Tver region.

Success is not a rankings promise. The product outcome is a useful article that helps a visitor make a decision, gives them a relevant low-pressure way to ask for help, and records whether that interaction becomes a lead.

The implementation must not use search spam, cloaking, doorway pages, keyword stuffing, fake reviews, behavioural-factor manipulation, or deceptive link schemes.

## Scope

This work includes all blog pages and the site's analytics integration:

- contextual inline and end-of-article lead forms;
- article FAQ and related-content blocks;
- data fields for article clusters, related articles, FAQ, CTA, and modification date;
- Yandex Metrika and Google Analytics 4 events for the article funnel;
- direct GA4 installation with measurement ID `G-Z45D1032QK`;
- removal of the non-functional `SearchAction` structured-data declaration;
- production validation and operational handoff for Search Console and Yandex Webmaster.

This work does not add a CMS, a site search feature, a new external dependency, paid advertising, or automated link building.

## Current constraints

- The site is a static Next.js application. Blog content lives in `src/lib/data.ts`.
- Existing article text remains a string. This project deliberately avoids migrating all articles to a block-based CMS model.
- Leads use the existing client-side `sendLead` helper and Web3Forms.
- The inline form collects only a user-entered name and phone number. The article, URL, CTA placement, CTA context, and UTM values are service metadata.
- Personal data must never be sent to Metrika or GA4.

## Data model

Extend `BlogPost` in `src/lib/data.ts` with the following types:

```ts
export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogCta {
  title: string;
  description: string;
  buttonLabel: string;
  context: string;
}

export type BlogCluster = "design" | "materials" | "planning" | "ordering";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modifiedDate: string;
  image: string;
  seoTitle: string;
  seoDescription: string;
  readTime: string;
  cluster: BlogCluster;
  relatedSlugs: string[];
  faq?: BlogFaqItem[];
  cta: BlogCta;
}
```

Existing posts receive values for every required field. `faq` is optional so a post without visible FAQ does not emit FAQ structured data.

## Components

### `BlogLeadForm`

Create `src/components/BlogLeadForm.tsx` as a client component.

Props:

```ts
interface BlogLeadFormProps {
  post: Pick<BlogPost, "slug" | "title" | "cta">;
  placement: "inline" | "bottom";
}
```

Behaviour:

- Render CTA title, description, name input, phone input, privacy-policy link, and button label from the post.
- Name and phone are required. Do not add a free-text message field in this release.
- On first focus of either input, record `blog_form_start` once.
- On submit, disable the button and show a sending state.
- Send one Web3Forms lead using the existing `sendLead` helper.
- On success, show a local confirmation state without redirecting away from the article.
- On error, preserve entered values, explain that the request was not sent, and offer the phone call link from `SITE_CONFIG`.

The request payload must use:

```ts
{
  name,
  phone,
  source: `Блог: ${post.slug}`,
  details: {
    "Статья": post.title,
    "URL статьи": window.location.href,
    "Место CTA": placement,
    "Контекст CTA": post.cta.context,
    "UTM source": getUtm("utm_source"),
    "UTM medium": getUtm("utm_medium"),
    "UTM campaign": getUtm("utm_campaign"),
    "UTM content": getUtm("utm_content"),
    "UTM term": getUtm("utm_term"),
  },
}
```

`getUtm` returns an empty string when the parameter is absent. It reads the current URL only and does not persist values in cookies or local storage.

### `BlogFaq`

Create `src/components/BlogFaq.tsx` as a presentational component. Render the exact question and answer data supplied by the post as visible accordion items or static sections. Do not include an FAQ item only in JSON-LD.

### `BlogRelatedPosts`

Create `src/components/BlogRelatedPosts.tsx`.

- Resolve posts by `relatedSlugs`, in the order declared by the current post.
- Ignore an unknown slug rather than failing the whole page.
- Render up to three related posts.
- Track a `blog_related_click` event when a visitor opens one.

### `BlogAnalytics`

Create `src/components/BlogAnalytics.tsx` as a client component for article-level events.

- Emit `blog_view` once on mount.
- Emit each of `blog_scroll_50`, `blog_scroll_75`, and `blog_scroll_90` only once when the corresponding document scroll percentage is reached.
- Remove the scroll listener on unmount.
- Never include UTM values, name, phone, or other personal data in analytics events.

## Article page composition

Update `src/app/(main)/blog/[slug]/page.tsx` in this order:

1. Breadcrumbs, date, title, and article image.
2. Article text through the second H2 section. If the content has fewer than two H2 markers, render the CTA after the first two paragraphs.
3. `BlogLeadForm` with `placement="inline"`.
4. Remaining article text.
5. Visible `BlogFaq`, only when `post.faq` has at least one item.
6. `BlogLeadForm` with `placement="bottom"`.
7. `BlogRelatedPosts`.
8. `BlogAnalytics`.

The generic link to `/#quiz` is removed from article pages. The homepage quiz remains unchanged.

Each article CTA must continue the article's task instead of making generic sales claims. Examples:

- Design article: "Проверить планировку до заказа".
- Black kitchen article: "Подобрать сочетание материалов".
- Small kitchen article: "Проверить, что поместится по размерам".
- Materials article: "Сравнить материалы для моей кухни".

## Analytics

### Event contract

Every blog event includes:

```ts
{
  article_slug: string;
  article_title: string;
  cta_placement?: "inline" | "bottom";
  cta_context?: string;
}
```

Events:

| Event | Trigger |
| --- | --- |
| `blog_view` | Article page mounted |
| `blog_scroll_50` | First reach of 50% document scroll |
| `blog_scroll_75` | First reach of 75% document scroll |
| `blog_scroll_90` | First reach of 90% document scroll |
| `blog_cta_click` | Submit button or form area first activated |
| `blog_form_start` | First focus in a form input |
| `blog_lead` | Successful Web3Forms response |
| `blog_related_click` | Related article link clicked |

`blog_cta_click` is recorded once per form placement when the visitor starts interacting with that CTA. `blog_lead` is recorded only after the form succeeds.

### Provider behaviour

Extend `src/lib/analytics.ts` with a provider-neutral `trackBlogEvent` helper.

- Keep the existing Yandex Metrika integration and send each event via `reachGoal`.
- Add a guarded `window.gtag` definition and send the same event names to GA4.
- If either provider is blocked or absent, swallow the analytics error. The article and form must stay functional.

Install GA4 once in `src/app/layout.tsx` using `next/script` and `G-Z45D1032QK`. Do not add Google Tag Manager. Do not install a second Google tag in nested pages.

## SEO and structured data

- Keep static generation, canonical URLs, article OpenGraph metadata, `robots.txt`, and `sitemap.xml`.
- Use `post.modifiedDate` for `dateModified` in both article schema and sitemap entry.
- Emit `FAQPage` schema only when the visible `BlogFaq` component renders at least one item.
- Remove `WebSite.potentialAction` / `SearchAction` from `src/lib/seo.ts` because `/catalog?q=` is not an implemented search surface.
- Use `relatedSlugs` for contextual internal linking. Do not fall back to the first entries in the blog array.
- Add editorial links in relevant article text to catalog, portfolio, pricing, and measurement pages. Links must answer the reader's current question.
- Continue using real project photography whenever available. Do not label stock imagery as a finished client project.
- Every annual article must be reviewed and updated before its year becomes stale. Update `modifiedDate` only when content changes materially.

## Editorial requirements

- Put the primary query in the H1, title, opening paragraph, and one relevant H2.
- Use secondary queries in sections that answer them. Do not repeat a phrase mechanically.
- Use concrete constraints, comparisons, and trade-offs. Explain where a solution is unsuitable.
- Avoid unsupported superiority claims, artificial urgency, and promotional filler.
- Add 4 to 6 FAQ items to high-intent articles after checking query data in Yandex Wordstat and Search Console.

## Operational work after deployment

The following steps require access to external accounts and are not automated by code:

1. Submit or re-submit `https://kuhnitver.ru/sitemap.xml` in Google Search Console and Yandex Webmaster.
2. Confirm both new article URLs are indexed.
3. Create the listed Metrika goals and GA4 custom definitions if the product UI requires them.
4. Review article query, CTR, CTA, and lead data monthly.
5. Maintain verified Yandex Business and Google Business Profile listings with consistent NAP data, real work photos, and real reviews.

## Acceptance criteria

- All existing posts build after adding the required metadata.
- A blog article renders an inline and bottom form without redirecting to the homepage.
- Successful email submissions contain the article title, article URL, CTA placement, CTA context, and present UTM values.
- Analytics event payloads do not contain name, phone, or free-text user input.
- `blog_lead` is emitted only after Web3Forms reports success.
- Article FAQ text is visible when FAQ schema is emitted.
- Related articles are determined by `relatedSlugs`, not array position.
- The rendered document contains only one GA4 tag.
- The site builds successfully, article routes, sitemap, and robots return HTTP 200 after deployment.

## Verification plan

1. Add unit tests for UTM extraction, analytics payload construction, related-slug resolution, and FAQ schema conditions.
2. Add component tests for form success, form error, and single-fire form-start tracking.
3. Run the production build.
4. In a browser, open an article with UTM parameters and submit both CTA placements using a test phone number.
5. Verify the Web3Forms email data and the Metrika and GA4 events.
6. After production deployment, verify the two article URLs, `robots.txt`, and `sitemap.xml` return HTTP 200.

## Out of scope

- Rewriting every existing article into a block-based editor.
- Adding a CMS or content administration interface.
- Building search for the catalog.
- Paid ads, automated backlink acquisition, review manipulation, or search-engine spam.
