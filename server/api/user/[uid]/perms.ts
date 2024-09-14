import {
	serverSupabaseUser,
	serverSupabaseServiceRole,
} from "#supabase/server";
import type { H3Event } from "h3";
import type { Database } from "~~/supabase/types";

export default defineEventHandler(async (event: H3Event) => {
	const user = await serverSupabaseUser(event);
	const supabase = serverSupabaseServiceRole<Database>(event);

	if (!user) throw createError({ status: 401, message: "Unauthorized" });

	const { id: requesterID } = user;
	const uid = getRouterParam(event, "uid") as string;

	if (requesterID !== uid || event.method !== "GET") {
		const { data, error } = await supabase
			.from("users")
			.select("perms")
			.eq("id", requesterID)
			.maybeSingle();
		if (error) throw createError(error);
		if (!data)
			throw createError({ status: 404, message: "User not found" });
		let { perms } = data;
		if (!perms) perms = [];
		if (!perms?.includes("root"))
			throw createError({ status: 403, message: "Forbidden" });
	}

	if (!uid) throw createError({ status: 400, message: "No user specified" });

	const { data, error } = await supabase
		.from("users")
		.select("perms")
		.eq("id", uid)
		.maybeSingle();
	if (error) throw createError(error);
	if (!data) throw createError({ status: 404, message: "User not found" });
	let { perms } = data;
	if (!perms) perms = [];
	switch (event.method) {
		case "GET": {
			return perms;
		}
		case "POST": {
			const { newPerms } = await readBody(event);
			if (newPerms.includes("root")) {
				throw createError({
					status: 403,
					message: "Root role is not modifiable",
				});
			}
			perms = perms.concat(newPerms);
			const { error: writeError } = await supabase
				.from("users")
				.update({
					perms,
				} as never)
				.eq("id", uid);
			if (writeError) throw createError(writeError);
			return { perms };
		}
		case "DELETE": {
			const { deletePerms } = await readBody(event);
			if (deletePerms.includes("root")) {
				throw createError({
					status: 403,
					message: "Root role is not modifiable",
				});
			}
			perms = perms.filter((p: string) => !deletePerms.includes(p));
			const { error: writeError } = await supabase
				.from("users")
				.update({
					perms,
				} as never)
				.eq("id", uid);
			if (writeError) throw createError(writeError);
			return {
				perms,
			};
		}
		default:
			throw createError({
				status: 405,
				message: "Method not allowed",
			});
	}
});
