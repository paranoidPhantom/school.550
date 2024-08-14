import type { Content } from "../types/content";

export default defineEventHandler(async (event) => {
	// EDIT_CONTENT ONLY
	const storage = useStorage(event.context.storage_driver);
	if (!event.context.perms || !event.context.perms.includes("edit_content")) {
		throw createError({
			statusCode: 403,
			statusMessage: "Can't delete content",
		});
	}
	const environment = process.env.NODE_ENV;
	try {
		const previousContent =
			(await storage.getItem<Content[]>(`${environment}_content`)) ?? [];
		const body = (await readBody(event)) as Content;
		previousContent.splice(
			previousContent.findIndex((item) => item.slug === body.slug),
			1,
		);
		await storage.setItem(`${environment}_content`, previousContent);
	} catch (error) {
		console.error("Error content.delete:", error);
		throw createError(error as Error);
	}
});
