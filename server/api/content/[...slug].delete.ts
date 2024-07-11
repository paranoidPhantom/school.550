import { kv } from "@vercel/kv";
import algoliasearch from "algoliasearch";

export default defineEventHandler(async (event) => {
    // EDIT_CONTENT ONLY
    if (!event.context.perms.includes("edit_content")) {
        throw createError({
            statusCode: 403,
            statusMessage: "Can't delete content",
        });
    }
    try {
        const { slug } = getRouterParams(event);
        const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
        await kv.del(`${environment}_content_${slug}`);
        await useStorage("cache").removeItem(
            `nitro:handlers:content:${slug}.json`
        );

        const algolia = algoliasearch(
            // @ts-expect-error
            process.env.ALGOLIA_APPLICATION_ID,
            process.env.ALGOLIA_API_KEY
        );
        const index = algolia.initIndex(`pages_${environment}`);

        index.deleteObject(slug);
    } catch (error) {
        console.error("Error content/[...slug].delete:", error);
        throw createError(error as Error);
    }
});
