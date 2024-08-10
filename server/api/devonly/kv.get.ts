export default defineEventHandler(async (event) => {
	if (import.meta.dev) {
		const storage = useStorage(event.context.storage_driver);
		const { env, key } = getQuery(event);
		const data = await storage.getItem(`${env}_${key}`);
		return data ?? "__undefined__";
	}
});
