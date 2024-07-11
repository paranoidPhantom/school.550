import { kv } from "@vercel/kv";
import type { Content } from "../types/content";

export default defineEventHandler(async (event) => {
    // EDIT_CONTENT ONLY
    if (!event.context.perms.includes("edit_content")) {
        throw createError({
            statusCode: 403,
            statusMessage: "Can't delete content",
        });
    }
    const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
    try {
        const previousContent =
            (await kv.get<Content[]>(`${environment}_content`)) ?? [];
        const body = (await readBody(event)) as Content;
        previousContent.splice(
            previousContent.findIndex((item) => item.slug === body.slug),
            1
        );
        await kv.set(`${environment}_content`, previousContent);
    } catch (error) {
        console.error("Error content.delete:", error);
        throw createError(error as Error);
    }
});
