import { kv } from "@vercel/kv";

export default defineEventHandler(async (event) => {
    try {
        const { slug } = getRouterParams(event);
        const md = await kv.get(`${process.env.NODE_ENV}_content_${slug}`);

        return md;
    } catch (error) {
        console.error(error);
        return `# API Error: ${(error as Error).message}`;
    }
});
