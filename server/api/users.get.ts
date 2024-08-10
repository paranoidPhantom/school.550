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
		const users =
			(await storage.getItem<User[]>(`${environment}_users`)) ?? [];
		return users;
	} catch (error) {
		console.error("Error users.get:", error);
		throw createError(error as Error);
	}
});
