import { kv } from "@vercel/kv";
import type { User } from "../types/user";

export default defineEventHandler(async (event) => {
    // ROOT ONLY
    if (!event.context.perms.includes("root")) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
        });
    }
    const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
    try {
        const users = (await kv.get<User[]>(`${environment}_users`)) ?? [];
        return users;
    } catch (error) {
        console.error("Error users.get:", error);
        throw createError(error as Error);
    }
});
