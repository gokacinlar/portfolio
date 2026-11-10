/**
 * Extracts the post slug from a URL slug format.
 *
 * URL format: {categorySlug}-{day}-{month}-{year}-{postSlug}
 * Example: dusunceler-28-07-2026-neden-linkedin-hesabim-yok
 *
 * Returns just the post slug portion: "neden-linkedin-hesabim-yok"
 */
export function extractPostSlugFromUrl(slug: string): string {
	const decoded: string = decodeURIComponent(slug).trim();
	const parts: string[] = decoded.split("-"); // Splitting marker is "-"
	// Skip category (1 segment) + date (3 segments: day-month-year)
	// Additional info may be added to url 
	// Then join the remaining parts as the post slug
	const rawSlug: string = parts.slice(4).join("-") ?? decoded;
	return rawSlug;
}
