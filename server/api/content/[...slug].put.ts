import algoliasearch from "algoliasearch";

export default defineEventHandler(async (event) => {
	// EDIT_CONTENT ONLY
	const storage = useStorage(event.context.storage_driver);
	if (!event.context.perms.includes("edit_content")) {
		throw createError({
			statusCode: 403,
			statusMessage: "Can't edit content",
		});
	}
	try {
		const { slug } = getRouterParams(event);
		const environment = process.env.NODE_ENV;
		const { md, title, description } = (await readBody(event)) as {
			title: string;
			description: string;
			md: string;
		};
		await storage.setItem(`${environment}_content_${slug}`, md);

		let hash = 0;
		const keyUnhashed = getRouterParams(event).slug;
		for (let i = 0; i < keyUnhashed.length; i++) {
			const chr = keyUnhashed.charCodeAt(i);
			hash = (hash << 5) - hash + chr;
			hash |= 0;
		}
		await useStorage("cache").removeItem(
			`nitro:handlers:content:${Math.abs(hash)}.json`,
		);
		const algolia = algoliasearch(
			process.env.ALGOLIA_APPLICATION_ID as string,
			process.env.ALGOLIA_API_KEY as string,
		);
		const index = algolia.initIndex(`pages_${environment}`);

		index.saveObject({
			objectID: slug,
			title: title.slice(0, 300),
			description: description.slice(0, 700),
			content: md
				.replaceAll("\n", " ")
				.replaceAll("-", "")
				.slice(0, 5000),
			slug,
		});
	} catch (error) {
		console.error("Error content/[...slug].put:", error);
		throw createError(error as Error);
	}
});
