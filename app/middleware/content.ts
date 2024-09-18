import { parseMarkdown } from "@nuxtjs/mdc/runtime";

export default defineNuxtRouteMiddleware(async (to) => {
	const supabase = useSupabaseClient();

	const { data } = await supabase
		.from("content")
		.select("md")
		.eq("slug", to.path)
		.maybeSingle();
	if (data) {
		const { md } = data;
		const ast = await parseMarkdown(md);
		to.meta.ast = ast;
	} else {
		return abortNavigation({
			statusCode: 404,
			message: "ツ",
		});
	}
});
