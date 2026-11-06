const htmlRanges = ["*/*", "text/*", "text/html"];
const qualityParameter = /^q\s*=\s*(0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/;
const utf8Parameter = /^charset\s*=\s*(?:utf-8|"utf-8")$/;

export function prefersMarkdown(accept: string | null): boolean {
  const html = { specificity: -1, quality: 0 };
  const markdown = { specificity: -1, quality: 0 };

  // Split on commas outside quoted media type parameters.
  const ranges = accept?.match(/(?:[^",]|"(?:[^"\\]|\\.)*")+/g) ?? [];
  for (const range of ranges) {
    const [mediaType, ...parameters] = range.trim().toLowerCase().split(/\s*;\s*/);
    const isMarkdown = mediaType === "text/markdown";
    const typeSpecificity = isMarkdown ? 2 : htmlRanges.indexOf(mediaType);
    if (typeSpecificity < 0) continue;

    let quality = 1;
    let hasCharset = false;
    for (const parameter of parameters) {
      const weight = qualityParameter.exec(parameter);
      if (weight) {
        quality = Number(weight[1]);
      } else if (utf8Parameter.test(parameter)) {
        hasCharset = true;
      } else if (parameter) {
        quality = -1;
        break;
      }
    }
    if (quality < 0) continue;

    const variant = isMarkdown ? markdown : html;
    const specificity = typeSpecificity * 2 + Number(hasCharset);
    if (specificity > variant.specificity ||
        (specificity === variant.specificity && quality > variant.quality)) {
      variant.specificity = specificity;
      variant.quality = quality;
    }
  }

  // Wildcards alone keep the default HTML. An explicit Markdown request wins ties.
  return markdown.quality > 0 && markdown.quality >= html.quality;
}
