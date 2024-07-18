import { createHmac, createHash } from "crypto";

export default defineEventHandler(async (event) => {
    // Skip middleware for non-API routes (performance)
    const storage = useStorage(event.context.storage_driver);
    const isAPI = event.path.startsWith("/api");
    const isContent =
        event.method === "GET" && event.path.match(/^\/api\/content\/(.*)$/);

    if (isAPI && !isContent) {
        event.context.perms = [];
        event.context.valid = false;

        try {
            const authObjectString = getCookie(event, "TG_AUTH_USER");
            const token = process.env.TG_BOT_TOKEN;

            if (authObjectString && token) {
                const authObject = JSON.parse(authObjectString);

                const hash = authObject.hash;

                // Generate validation string
                const objectKeys = Object.keys(authObject)
                    .filter((v) => v !== "hash")
                    .sort();
                const authString = objectKeys
                    .map((key) => `${key}=${authObject[key]}`)
                    .join("\n");

                const SHA256 = (value: string) => {
                    return createHash("sha256").update(value).digest();
                };

                const HMAC_SHA256 = (value: string, key: Buffer | string) => {
                    return createHmac("sha256", key).update(value).digest();
                };

                const hex = (bytes: any) => {
                    return bytes.toString("hex");
                };

                // Generate secret key
                const secret_key = SHA256(token);

                // Generate hash to validate
                const hashGenerate = hex(HMAC_SHA256(authString, secret_key));

                // Calculate age of the hash
                const age =
                    Math.floor(Date.now() / 1000) - authObject.auth_date;

                // Return bool value is valid

                const valid = Boolean(
                    hashGenerate === hash && age < 14 * 24 * 60 * 60 // Invalidate after 14 days
                );
                event.context.valid = valid;

                if (valid) {
                    // If user is valid
                    event.context.user = authObject;
                    const environment = process.env.NODE_ENV;
                    // Get user permissions
                    const perms =
                        (await storage.getItem(
                            `${environment}_auth_perms_${authObject.id}`
                        )) ?? [];
                    event.context.perms = perms;

                    storage
                        .getItem(`${environment}_auth_byid_${authObject.id}`)
                        .then(async (user) => {
                            if (!user) {
                                // Save user in DB if he just "signed up"
                                await storage.setItem(
                                    `${environment}_auth_byid_${authObject.id}`,
                                    authObject
                                );
                            }
                        });
                }
            }
        } catch (error) {
            console.error("Error auth middleware:", error);
            throw createError(error as Error);
        }
    }
});
