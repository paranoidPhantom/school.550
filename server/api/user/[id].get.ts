import { kv } from "@vercel/kv";
import type { User } from "~~/server/types/user";

export default defineEventHandler(async (event) => {
    const { id } = getRouterParams(event);
    const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
    try {
        const user = await kv.get<User>(`${environment}_auth_byid_${id}`);
        return user;
    } catch (error) {
        console.error("Error user/[id].get:", error);
        throw createError(error as Error);
    }
});
