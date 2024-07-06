import { kv } from "@vercel/kv";

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
        const { md } = (await readBody(event)) as { md: string };
        await kv.set(`${environment}_content_${slug}`, md);
    } catch (error) {
        console.error("Error content/[...slug].put:", error);
        throw createError(error as Error);
    }
});
