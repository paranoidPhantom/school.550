import algoliasearch from "algoliasearch";

export default defineEventHandler(async (event) => {
    // EDIT_CONTENT ONLY
    const storage = useStorage(event.context.storage_driver);
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
        await storage.setItem(`${environment}_content_${slug}`, md);
        await useStorage("cache").removeItem(
            `nitro:handlers:content:${slug.replaceAll("/", "_")}.json`
        );

        const algolia = algoliasearch(
            // @ts-expect-error
            process.env.ALGOLIA_APPLICATION_ID,
            process.env.ALGOLIA_API_KEY
        );
        const index = algolia.initIndex(`pages_${environment}`);

        index.saveObject({
            objectID: slug,
            title: title.slice(0, 300),
            description: description.slice(0, 700),
            content: md
                .replaceAll("\n", " ")
                .replaceAll("-", "")
                .slice(0, 5000),
            slug,
        });
    } catch (error) {
        console.error("Error content/[...slug].put:", error);
        throw createError(error as Error);
    }
});
