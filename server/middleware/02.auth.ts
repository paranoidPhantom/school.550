import { serverTelegramUser } from "#tgauth/server";

export default defineEventHandler(async (event) => {
    // Skip middleware for non-API routes (performance)
    const storage = useStorage(event.context.storage_driver);
    const isAPI = event.path.startsWith("/api");
    const isContent =
        event.method === "GET" && event.path.match(/^\/api\/content\/(.*)$/);

    if (isAPI && !isContent) {
        const { valid, user } = await serverTelegramUser(event);

        event.context.perms = [];
        event.context.valid = valid;

        try {
            if (valid && user) {
                // If user is valid
                event.context.user = user;
                const environment = process.env.NODE_ENV;
                // Get user permissions
                const perms =
                    (await storage.getItem(
                        `${environment}_auth_perms_${user.id}`
                    )) ?? [];
                event.context.perms = perms;

                storage
                    .getItem(`${environment}_auth_byid_${user.id}`)
                    .then(async (userCheck) => {
                        if (!userCheck) {
                            // Save user in DB if he just "signed up"
                            await storage.setItem(
                                `${environment}_auth_byid_${user.id}`,
                                user
                            );
                        }
                    });
            }
        } catch (error) {
            console.error("Error auth middleware:", error);
            throw createError(error as Error);
        }
    }
});
