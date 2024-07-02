import { createHmac, createHash } from "crypto";
import { kv } from "@vercel/kv";

export default defineEventHandler(async (event) => {
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

            function SHA256(value: string) {
                return createHash("sha256").update(value).digest();
            }

            function HMAC_SHA256(value: string, key: Buffer | string) {
                return createHmac("sha256", key).update(value).digest();
            }

            function hex(bytes: any) {
                return bytes.toString("hex");
            }

            // Generate secret key
            const secret_key = SHA256(token);

            // Generate hash to validate
            const hashGenerate = hex(HMAC_SHA256(authString, secret_key));

            // Return bool value is valid
            const valid = Boolean(hashGenerate === hash);
            event.context.valid = valid;

            if (valid) {
                event.context.user = authObject;
                const perms =
                    (await kv.get(`auth_perms_${authObject.id}`)) ?? [];
                event.context.perms = perms;
            }
        }
    } catch (error) {
        console.error(error);
    }
});
