export default defineEventHandler(async (event) => {
	if (import.meta.dev) {
		const storage = useStorage(event.context.storage_driver);
		const { env, key, value } = await readBody(event);
		await storage.setItem(`${env}_${key}`, value);
	}
});
