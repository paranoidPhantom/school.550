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
        const previousUsers =
            (await kv.get<User[]>(`${environment}_users`)) ?? [];
        const body = (await readBody(event)) as User;
        for (const user of previousUsers) {
            if (user.id === body.id) {
                return createError({
                    statusCode: 400,
                    statusMessage: "User already exists",
                });
            }
        }
        await kv.set(`${environment}_users`, [...previousUsers, body]);
    } catch (error) {
        console.error("Error users.post:", error);
        throw createError(error as Error);
    }
});
