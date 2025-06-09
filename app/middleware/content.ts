import { parseMarkdown } from "@nuxtjs/mdc/runtime";

export default defineNuxtRouteMiddleware(async (to) => {
  const md = await $fetch("/api/content", {
    params: {
      route: to.path,
    },
  });
	if (md) {
		const tree = await parseMarkdown(md);

		to.meta = { ...to.meta, ...tree.data, ast: tree };
	} else {
		return abortNavigation({
			statusCode: 404,
			message: "Страница не найдена",
		});
  }
});
