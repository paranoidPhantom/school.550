import type { Content } from "../types/content";

export default defineEventHandler(async (event) => {
	// EDIT_CONTENT ONLY
	const storage = useStorage(event.context.storage_driver);
	if (!event.context.perms || !event.context.perms.includes("edit_content")) {
		throw createError({
			statusCode: 403,
			statusMessage: "Can't edit content",
		});
	}
	const environment = process.env.NODE_ENV;
	try {
		const previousContent =
			(await storage.getItem<Content[]>(`${environment}_content`)) ?? [];
		const body = (await readBody(event)) as Content;
		for (const content of previousContent) {
			if (content.slug === body.slug) {
				return createError({
					statusCode: 400,
					statusMessage: "Content page already exists",
				});
			}
		}
		const { id: UID } = await event.context.user;
		await storage.setItem(`${environment}_content`, [
			...previousContent,
			{ ...body, created_by: UID, last_edited: new Date().toISOString() },
		]);
	} catch (error) {
		console.error("Error content.post:", error);
		throw createError(error as Error);
	}
});
