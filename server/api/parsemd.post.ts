import { parseMarkdown } from "#imports";

export default defineEventHandler(async (event) => {
	const { markdown } = await readBody(event);
	return await parseMarkdown(markdown);
});
