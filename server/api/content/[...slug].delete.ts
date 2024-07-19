import algoliasearch from "algoliasearch";

export default defineEventHandler(async (event) => {
    // EDIT_CONTENT ONLY
    const storage = useStorage(event.context.storage_driver);
    if (!event.context.perms.includes("edit_content")) {
        throw createError({
            statusCode: 403,
            statusMessage: "Can't delete content",
        });
    }
    try {
        const { slug } = getRouterParams(event);
        const environment = process.env.NODE_ENV;
        await storage.removeItem(`${environment}_content_${slug}`);
        await useStorage("cache").removeItem(
            `nitro:handlers:content:${slug}.json`
        );

        const algolia = algoliasearch(
            process.env.ALGOLIA_APPLICATION_ID as string,
            process.env.ALGOLIA_API_KEY as string
        );
        const index = algolia.initIndex(`pages_${environment}`);

        index.deleteObject(slug);
    } catch (error) {
        console.error("Error content/[...slug].delete:", error);
        throw createError(error as Error);
    }
});
