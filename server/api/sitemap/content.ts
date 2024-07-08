import { kv } from "@vercel/kv";
import type { Content } from "../../types/content";

export default defineCachedEventHandler(
    async (event) => {
        const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
        try {
            const content =
                (await kv.get<Content[]>(`${environment}_content`)) ?? [];
            return content.map((p) =>
                asSitemapUrl({
                    loc: p.slug,
                })
            );
        } catch (error) {
            console.error("Sitemap error:", error);
        }
    },
    {
        maxAge: 60, // Sitemap cachced for 1 minute
    }
);
