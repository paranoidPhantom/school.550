import { snapshot } from "unstorage";
export default defineEventHandler(async (event) => {
	if (import.meta.dev) {
		const storage = useStorage(event.context.storage_driver);
		const data = await snapshot(storage, "");
		return data;
	}
});
