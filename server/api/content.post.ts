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
        const previousContent =
            (await kv.get<Content[]>(`${environment}_content`)) ?? [];
        const body = (await readBody(event)) as Content;
        for (const content of previousContent) {
            if (content.slug === body.slug) {
                return createError({
                    statusCode: 400,
                    statusMessage: "Content page already exists",
                });
            }
        }
        const { id: UID } = await event.context.user;
        await kv.set(`${environment}_content`, [
            ...previousContent,
            { ...body, created_by: UID },
        ]);
    } catch (error) {
        console.error("Error content.post:", error);
        throw createError(error as Error);
    }
});
