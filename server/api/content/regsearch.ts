import {
	serverSupabaseUser,
	serverSupabaseServiceRole,
} from "#supabase/server";
import { algoliasearch } from "algoliasearch";
import type { Database } from "~~/supabase/types";

export default defineEventHandler(async (event) => {
	if (!["PUT", "DELETE"].includes(event.method))
		throw createError({ status: 405, message: "Method not allowed" });

	const user = await serverSupabaseUser(event);
	const supabase = serverSupabaseServiceRole<Database>(event);

	if (!user) throw createError({ status: 401, message: "Unauthorized" });

	const { id: requesterID } = user;

	const { data, error } = await supabase
		.from("users")
		.select("perms")
		.eq("id", requesterID)
		.maybeSingle();
	if (error) throw createError(error);
	if (!data) throw createError({ status: 404, message: "User not found" });
	let { perms } = data;
	if (!perms) perms = [];
	if (!perms?.includes("edit_content"))
		throw createError({ status: 403, message: "Forbidden" });

	// Update algolia index
	const algolia = algoliasearch(
		process.env.ALGOLIA_APPLICATION_ID as string,
		process.env.ALGOLIA_API_KEY as string,
	);

	try {
		if (event.method === "PUT") {
			const { title, description, md, slug } = await readBody(event);
			algolia.saveObject({
				indexName: `pages_production`,
				body: {
					objectID: slug,
					title: title.slice(0, 300),
					description: description.slice(0, 700),
					content: md
						.replaceAll("\n", " ")
						.replaceAll("-", "")
						.slice(0, 5000),
					slug,
				},
			});
		} else if (event.method === "DELETE") {
			const { slug } = await readBody(event);
			algolia.deleteObject({
				indexName: `pages_production`,
				objectID: slug,
			});
		}
	} catch (error) {
		throw createError(error as Error);
	}
});
