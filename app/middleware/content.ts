export default defineNuxtRouteMiddleware(async (to, from) => {
    const {
        params: { slug },
    } = to as unknown as { params: { slug: string[] } };
    const { data: md } = await useFetch(`/api/content/${slug.join("/")}`);

    if (md.value) {
        to.meta.md = md.value;
    } else {
        return abortNavigation({
            statusCode: 404,
            message: "Not found",
        });
    }
});
