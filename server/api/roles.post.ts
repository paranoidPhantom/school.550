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
        const previousRoles =
            (await kv.get<Role[]>(`${environment}_roles`)) ?? [];
        const body = (await readBody(event)) as Role;
        for (const role of previousRoles) {
            if (role.key === body.key) {
                throw createError({
                    statusCode: 400,
                    statusMessage: "Role already exists",
                });
            }
        }

        await kv.set(`${environment}_roles`, [...previousRoles, body]);
    } catch (error) {
        console.error("Error roles.put:", error);
    }
});
