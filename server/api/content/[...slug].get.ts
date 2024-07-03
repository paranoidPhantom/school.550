import { kv } from "@vercel/kv";

export default defineEventHandler(async (event) => {
    try {
        const { slug } = getRouterParams(event);
        const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
        const md = await kv.get(`${environment}_content_${slug}`);

        return md;
    } catch (error) {
        console.error("Error content/[....get:", error);
        return `# API Error: ${(error as Error).message}`;
    }
});
