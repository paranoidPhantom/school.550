import { kv } from "@vercel/kv";
import algoliasearch from "algoliasearch";

export default defineEventHandler(async (event) => {
    // EDIT_CONTENT ONLY
    if (!event.context.perms.includes("edit_content")) {
        throw createError({
            statusCode: 403,
            statusMessage: "Can't edit content",
        });
    }
    try {
        const { slug } = getRouterParams(event);
        const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
        const { md, title, description } = (await readBody(event)) as {
            title: string;
            description: string;
            md: string;
        };
        await kv.set(`${environment}_content_${slug}`, md);
        await useStorage("cache").removeItem(
            `nitro:handlers:content:${slug}.json`
        );

        const algolia = algoliasearch(
            // @ts-expect-error
            process.env.ALGOLIA_APPLICATION_ID,
            process.env.ALGOLIA_API_KEY
        );
        const index = algolia.initIndex(`pages_${environment}`);

        index.saveObject({
            objectID: slug,
            title,
            description,
            content: md,
            slug,
        });
    } catch (error) {
        console.error("Error content/[...slug].put:", error);
        throw createError(error as Error);
    }
});
