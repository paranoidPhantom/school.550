import type { Content } from "../types/content";

export default defineEventHandler(async (event) => {
    // EDIT_CONTENT ONLY
    const storage = useStorage(event.context.storage_driver);
    if (!event.context.perms.includes("edit_content")) {
        throw createError({
            statusCode: 403,
            message: `Cant edit content`,
        });
    }
    const environment = process.env.NODE_ENV;
    try {
        const content =
            (await storage.getItem<Content[]>(`${environment}_content`)) ?? [];
        return content;
    } catch (error) {
        console.error("Error content.get:", error);
        throw createError(error as Error);
    }
});
