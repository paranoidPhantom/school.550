export default defineCachedEventHandler(
    async (event) => {
        try {
            const storage = useStorage(event.context.storage_driver);
            const { slug } = getRouterParams(event);
            const environment = process.env.NODE_ENV;
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
        getKey: (event) => {
            let hash = 0;
            const keyUnhashed = getRouterParams(event).slug;
            for (let i = 0; i < keyUnhashed.length; i++) {
                const chr = keyUnhashed.charCodeAt(i);
                hash = (hash << 5) - hash + chr;
                hash |= 0;
            }
            return `${Math.abs(hash)}`;
        },
    }
);
