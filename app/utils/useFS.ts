export default async (...args: (typeof $fetch)["arguments"]) => {
    const {
        public: { file_server_url },
    } = useRuntimeConfig();
    const fstoken = useCookie<string | undefined>("fstoken");
    if (!fstoken.value) {
        const token = (await $fetch(`/api/auth/fstoken`)) as string;
        fstoken.value = token;
    }
    try {
        const response = await $fetch(`${file_server_url}${args[0]}`, {
            ...args[1],
            headers: {
                fstoken: fstoken.value,
            },
        });
        return response;
    } catch (error) {
        const token = (await $fetch(`/api/auth/fstoken`)) as string;
        fstoken.value = token;
        const response = await $fetch(`${file_server_url}${args[0]}`, {
            ...args[1],
            headers: {
                fstoken: fstoken.value,
            },
        });
        return response;
    }
};
