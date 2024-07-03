export default defineNuxtRouteMiddleware(async (to, from) => {
    const {
        params: { slug },
    } = to;
    const { data: md } = await useFetch(`/api/content/${slug}`);

    if (md.value) {
        to.meta.md = md.value;
    } else {
        return abortNavigation({
            statusCode: 404,
            message: "Not found",
        });
    }
});
