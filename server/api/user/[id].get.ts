import type { User } from "~~/server/types/user";

export default defineEventHandler(async (event) => {
    const storage = useStorage(event.context.storage_driver);
    const { id } = getRouterParams(event);
    const environment = process.env.NODE_ENV;
    try {
        const user = await storage.getItem<User>(
            `${environment}_auth_byid_${id}`
        );
        return user;
    } catch (error) {
        console.error("Error user/[id].get:", error);
        throw createError(error as Error);
    }
});
