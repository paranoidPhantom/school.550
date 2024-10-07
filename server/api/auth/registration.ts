import { serverSupabaseServiceRole } from "#supabase/server";

import type { Database } from "~~/supabase/types";

export default defineEventHandler(async (event) => {
	if (!["GET", "POST"].includes(event.method)) {
		throw createError({
			statusCode: 405,
			statusMessage: "Method not allowed",
		});
	}

	const { id } = getQuery(event);
	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "No ID provided with request",
		});
	}

	const supabase = serverSupabaseServiceRole<Database>(event);

	const { data, error } = await supabase
		.from("registration-links")
		.select()
		.eq("id", id)
		.maybeSingle();
	if (error) {
		throw createError({
			status: 400,
			message: "Bad credentials",
		});
	}
	if (!data) throw createError({ status: 404, message: "Not found" });
	if (data.activated_at)
		throw createError({
			status: 403,
			message: "Already activated",
		});

	switch (event.method) {
		case "GET": {
			return data.metadata;
		}
		case "POST": {
			const { email, password } = await readBody(event);
			if (!email || !password)
				throw createError({
					status: 400,
					message: "Data is incomplete",
				});
			const { data: newUser, error: newUserError } =
				await supabase.auth.admin.createUser({
					email,
					password,
					email_confirm: true,
					user_metadata: data.metadata as object,
				});
			if (newUserError) throw createError(newUserError);
			if (!newUser)
				throw createError({
					status: 500,
					message: "User was not created and an error was not thrown",
				});

			const { error: activationError } = await supabase
				.from("registration-links")
				.update({ activated_at: new Date().toISOString() })
				.eq("id", id);

			if (activationError)
				throw createError({
					status: 500,
					message: "Activation error",
				});

			const perms = data["initial-perms"];

			perms.filter((perm) => perm !== "root");

			await supabase
				.from("users")
				.update({
					perms,
				})
				.eq("id", newUser.user.id);
		}
	}
});
