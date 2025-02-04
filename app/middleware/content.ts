export default defineNuxtRouteMiddleware(async (to) => {
	const supabase = useSupabaseClient();
	const { data, error } = await supabase
		.from("content")
		.select("slug")
		.eq("slug", to.path)
		.maybeSingle();
	if (!data || error)
		abortNavigation({
			statusCode: 404,
			message: "Страница не найдена",
		});
});
