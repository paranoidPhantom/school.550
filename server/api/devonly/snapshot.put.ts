import { restoreSnapshot } from "unstorage";
export default defineEventHandler(async (event) => {
	if (import.meta.dev) {
		const body = await readBody(event);
		const storage = useStorage(event.context.storage_driver);
		await restoreSnapshot(storage, body);
	}
});
