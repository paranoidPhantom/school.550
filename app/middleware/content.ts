import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import type { Database } from "~~/supabase/types";

export default defineNuxtRouteMiddleware(async (to) => {
	const supabase = useSupabaseClient<Database>();
	const { data, error } = await supabase
		.from("content")
		.select("slug, md")
		.eq("slug", to.path)
		.maybeSingle();
	if (!data || error) {
		return abortNavigation({
			statusCode: 404,
			message: "Страница не найдена",
		});
	} else if (data) {
		const tree = await parseMarkdown(data.md);

		to.meta = { ...to.meta, ...tree.data, ast: tree };
	}
});
