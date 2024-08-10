import type { Role } from "../types/role";

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
		const previousRoles =
			(await storage.getItem<Role[]>(`${environment}_roles`)) ?? [];
		const body = (await readBody(event)) as Role;
		for (const role of previousRoles) {
			if (role.key === body.key) {
				return createError({
					statusCode: 400,
					statusMessage: "Role already exists",
				});
			}
		}

		await storage.setItem(`${environment}_roles`, [...previousRoles, body]);
	} catch (error) {
		console.error("Error roles.put:", error);
		throw createError(error as Error);
	}
});
