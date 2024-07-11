import type { Role } from "../../../types/role";

export default defineEventHandler(async (event) => {
    // ROOT ONLY
    const storage = useStorage(event.context.storage_driver);
    if (!event.context.perms.includes("root")) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
        });
    }
    const { id } = getRouterParams(event);
    const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
    try {
        const roles =
            (await storage.getItem<string[]>(
                `${environment}_auth_perms_${id}`
            )) ?? [];
        return roles;
    } catch (error) {
        console.error("Error user/[id]/roles.get:", error);
        throw createError(error as Error);
    }
});
