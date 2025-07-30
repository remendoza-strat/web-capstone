// Remove tags from input
export function StripHTML(html: string): string{
  return html.replace(/<[^>]+>/g, "").trim();
}