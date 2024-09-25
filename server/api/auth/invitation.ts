import {
	serverSupabaseUser,
	serverSupabaseServiceRole,
} from "#supabase/server";
import type { Database } from "~~/supabase/types";

export default defineEventHandler(async (event) => {
	if (!["GET", "POST"].includes(event.method)) {
		throw createError({
			statusCode: 405,
			statusMessage: "Method not allowed",
		});
	}
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
	if (!perms?.includes("root"))
		throw createError({ status: 403, message: "Forbidden" });

	switch (event.method) {
		case "GET": {
			const { data: invitations, error: invitationsError } =
				await supabase.from("registration-links").select();
			if (invitationsError) throw createError(invitationsError);
			return invitations;
		}
		case "POST": {
			const { metadata, initialPerms } = await readBody(event);
			const { data: invitation, error: invitationError } = await supabase
				.from("registration-links")
				.insert({
					metadata,
					"initial-perms": initialPerms,
				})
				.select()
				.maybeSingle();
			if (invitationError) throw createError(invitationError);
			if (!invitation)
				throw createError({
					status: 500,
					message:
						"Invitation was not created and an error was not thrown",
				});
			return invitation;
		}
	}
});
