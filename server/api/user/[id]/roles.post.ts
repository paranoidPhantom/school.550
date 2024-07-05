import { kv } from "@vercel/kv";
import type { Role } from "../../../types/role";

export default defineEventHandler(async (event) => {
    // ROOT ONLY
    if (!event.context.perms.includes("root")) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
        });
    }
    const { id } = getRouterParams(event);
    const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
    try {
        const body = (await readBody(event)) as { role: string };
        const roles =
            (await kv.get<Role["key"][]>(`${environment}_auth_perms_${id}`)) ??
            [];
        if (roles.includes(body.role)) {
            return createError({
                statusCode: 400,
                statusMessage: "User already has this role",
            });
        }
        await kv.set(`${environment}_auth_perms_${id}`, [...roles, body.role]);
    } catch (error) {
        console.error("Error user/[id]/roles.post:", error);
        throw createError(error as Error);
    }
});
