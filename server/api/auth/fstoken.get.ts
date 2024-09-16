import {
	serverSupabaseUser,
	serverSupabaseServiceRole,
} from "#supabase/server";
import { SignJWT } from "jose";
import type { Database } from "~~/supabase/types";

export default defineEventHandler(async (event) => {
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
	if (!perms?.includes("fs"))
		throw createError({ status: 403, message: "Forbidden" });

	const secret = new TextEncoder().encode(process.env.FILE_SERVER_SIGNATURE);
	const alg = "HS256";

	const jwt = await new SignJWT()
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setIssuer("nitro.api")
		.setAudience(requesterID)
		.setExpirationTime("1h")
		.sign(secret);

	return jwt;
});
