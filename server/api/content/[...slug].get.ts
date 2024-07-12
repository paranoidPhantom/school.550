export default defineCachedEventHandler(
    async (event) => {
        try {
            const storage = useStorage(event.context.storage_driver);
            const { slug } = getRouterParams(event);
            const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
            const md = await storage.getItem<string>(
                `${environment}_content_${slug}`
            );

            return md;
        } catch (error) {
            console.error("Error content/[....get:", error);
            throw createError(error as Error);
        }
    },
    {
        name: "content",
        maxAge: 28800,
        getKey: (event) => getRouterParams(event).slug.replaceAll("/", "_"),
    }
);
