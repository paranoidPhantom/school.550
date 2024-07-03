import { kv } from "@vercel/kv";
import { Role } from "../types/role";

export default defineEventHandler(async (event) => {
    if (!event.context.perms.includes("root")) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
        });
    }
    const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
    try {
        const roles = (await kv.get<Role[]>(`${environment}_roles`)) ?? [];
        return roles;
    } catch (error) {
        console.error("Error roles.get:", error);
        return [];
    }
});
