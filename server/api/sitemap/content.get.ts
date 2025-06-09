import type { Database } from "~~/supabase/types";
import { serverSupabaseServiceRole } from "#supabase/server";

export default defineCachedEventHandler(
	async (event) => {
		const supabase = serverSupabaseServiceRole<Database>(event);
		try {
			const { data: content } = await supabase
				.from("content")
				.select("slug, updated_at, restricted");
			if (content) {
				return content.map((p) =>
					p.restricted
						? null
						: asSitemapUrl({
								loc: p.slug,
								lastmod: p.updated_at,
							}),
				);
			}
		} catch (error) {
			console.error("Sitemap error:", error);
		}
	},
	{
		maxAge: 60, // Sitemap cachced for 1 minute
	},
);
