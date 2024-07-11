export default defineEventHandler(async (event) => {
    event.context.storage_driver = "vercel";
});
