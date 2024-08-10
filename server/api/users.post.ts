import type { User } from "../types/user";

export default defineEventHandler(async (event) => {
	// ROOT ONLY
	const storage = useStorage(event.context.storage_driver);
	if (!event.context.perms.includes("root")) {
		throw createError({
			statusCode: 403,
			statusMessage: "Forbidden",
		});
	}
	const environment = process.env.NODE_ENV;
	try {
		const previousUsers =
			(await storage.getItem<User[]>(`${environment}_users`)) ?? [];
		const body = (await readBody(event)) as User;
		for (const user of previousUsers) {
			if (user.id === body.id) {
				return createError({
					statusCode: 400,
					statusMessage: "User already exists",
				});
			}
		}
		await storage.setItem(`${environment}_users`, [...previousUsers, body]);
	} catch (error) {
		console.error("Error users.post:", error);
		throw createError(error as Error);
	}
});
