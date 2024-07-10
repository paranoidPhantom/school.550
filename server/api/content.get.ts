import { kv } from "@vercel/kv";
import type { Content } from "../types/content";

export default defineEventHandler(async (event) => {
    // EDIT_CONTENT ONLY
    if (!event.context.perms.includes("edit_content")) {
        throw createError({
            statusCode: 403,
            statusMessage: "Can't edit content",
        });
    }
    const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
    try {
        const content =
            (await kv.get<Content[]>(`${environment}_content`)) ?? [];
        return content;
    } catch (error) {
        console.error("Error content.get:", error);
        throw createError(error as Error);
    }
});
