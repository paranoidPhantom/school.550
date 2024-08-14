import type { Role } from "../../../types/role";

export default defineEventHandler(async (event) => {
	// ROOT ONLY
	const storage = useStorage(event.context.storage_driver);
	if (!event.context.perms || !event.context.perms.includes("root")) {
		throw createError({
			statusCode: 403,
			statusMessage: "Forbidden",
		});
	}
	const { id } = getRouterParams(event);
	const environment = process.env.NODE_ENV;
	try {
		const body = (await readBody(event)) as { role: string };
		const roles =
			(await storage.getItem<Role["key"][]>(
				`${environment}_auth_perms_${id}`,
			)) ?? [];
		if (!roles.includes(body.role)) {
			return createError({
				statusCode: 400,
				statusMessage: "User does not have this role",
			});
		}
		roles.splice(roles.indexOf(body.role), 1);
		await storage.setItem(`${environment}_auth_perms_${id}`, roles);
	} catch (error) {
		console.error("Error user/[id]/roles.delete:", error);
		throw createError(error as Error);
	}
});
