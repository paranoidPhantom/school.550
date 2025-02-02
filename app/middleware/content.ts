export default defineNuxtRouteMiddleware(async (to) => {
	const supabase = useSupabaseClient();
	const { data } = await supabase
		.from("content")
		.select("slug")
		.eq("slug", to.path)
		.maybeSingle();
	if (!data) {
		return abortNavigation({
			statusCode: 404,
			message: "ツ",
		});
	}
});
