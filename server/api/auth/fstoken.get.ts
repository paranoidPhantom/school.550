import { SignJWT } from "jose";

export default defineEventHandler(async (event) => {
	const { perms } = event.context;
	if (perms.includes("fs")) {
		const { user } = event.context;
		if (user && Object.prototype.hasOwnProperty.call(user, "id")) {
			const secret = new TextEncoder().encode(
				process.env.FILE_SERVER_SIGNATURE,
			);
			const alg = "HS256";

			const jwt = await new SignJWT()
				.setProtectedHeader({ alg })
				.setIssuedAt()
				.setIssuer("nitro.api")
				.setAudience(user.id)
				.setExpirationTime("1h")
				.sign(secret);

			return jwt;
		}
	}
});
