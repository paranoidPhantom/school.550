import type { Role } from "../types/role";

export default defineEventHandler(async (event) => {
    const storage = useStorage(event.context.storage_driver);
    if (!event.context.perms.includes("root")) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
        });
    }
    const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
    try {
        const roles =
            (await storage.getItem<Role[]>(`${environment}_roles`)) ?? [];
        return roles;
    } catch (error) {
        console.error("Error roles.get:", error);
        throw createError(error as Error);
    }
});
