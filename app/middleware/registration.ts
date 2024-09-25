export default defineNuxtRouteMiddleware(async (to) => {
	const { id } = to.params;
	try {
		const metadata = (await $fetch(`/api/auth/registration`, {
			query: { id },
		})) as Record<string, string>;
		to.meta.metadata = metadata;
		to.meta.id = id;
		to.meta.title = `Регистрация - ${metadata.first_name} ${metadata.last_name}`;
	} catch (error) {
		return abortNavigation(error as Error);
	}
});
