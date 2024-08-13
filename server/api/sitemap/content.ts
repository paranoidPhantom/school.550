import type { Content } from "../../types/content";

export default defineCachedEventHandler(
	async (event) => {
		const storage = useStorage(event.context.storage_driver);
		const environment = process.env.NODE_ENV;
		try {
			const content =
				(await storage.getItem<Content[]>(`${environment}_content`)) ??
				[];
			return content.map((p) =>
				asSitemapUrl({
					loc: p.slug,
					lastmod: p.last_edited,
				}),
			);
		} catch (error) {
			console.error("Sitemap error:", error);
		}
	},
	{
		maxAge: 60, // Sitemap cachced for 1 minute
	},
);
