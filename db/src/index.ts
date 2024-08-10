// File system imports
import {
	unlinkSync,
	readdirSync,
	statSync,
	mkdirSync,
	rmdirSync,
	existsSync,
	createWriteStream,
} from "node:fs";
import { readdir } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { join } from "node:path";

// Elysia imports
import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

// Other imports
import { jwtVerify } from "jose";
import archiver from "archiver";

if (!existsSync(join(import.meta.dir, "../", "storage")))
	mkdirSync(join(import.meta.dir, "../", "storage"));
if (!existsSync(join(import.meta.dir, "../", "temp")))
	mkdirSync(join(import.meta.dir, "../", "temp"));

const secret = new TextEncoder().encode(Bun.env.FILE_SERVER_SIGNATURE);

const handleError = ({ code, error }: { code: string; error: Error }) => {
	switch (code) {
		case "ERR_JWS_INVALID":
			return "Token invalid";
		case "ERR_JWT_EXPIRED":
			return "Token expired";
		default:
			console.error(error);
			return "Internal server error";
	}
};

const app = new Elysia()
	.use(cors())
	.onError(handleError)
	.get("/*", ({ path }) => {
		path = decodeURI(path);
		const filePath = `storage${path}`;
		const file = Bun.file(filePath);
		const stats = statSync(join(import.meta.dir, "../", filePath));
		if (stats.isDirectory()) {
			return new Response("Provided path points to a directory", {
				status: 404,
			});
		}
		return file;
	})
	.onError(handleError)
	.get("/download/*", async ({ path }) => {
		path = decodeURI(path);
		const filePath = `storage${path.split("/download")[1] ?? ""}`;
		const file = Bun.file(filePath);
		const stats = statSync(join(import.meta.dir, "../", filePath));
		if (stats.isDirectory()) {
			// Cleanup other zips
			const zips = await readdir(join(import.meta.dir, "../", "temp"));
			zips.forEach((file) => {
				if (file.endsWith(".zip")) {
					unlinkSync(join(import.meta.dir, "../", "temp", file));
				}
			});

			// Create the write stream
			const outputPath = `temp/${Date.now()}.zip`;

			// read all the files in the current directory
			const archiveOutput = createWriteStream(
				join(import.meta.dir, "../", outputPath),
			);
			// Create the archive
			const archive = archiver("zip", {
				zlib: { level: 9 }, // Sets the compression level.
			});
			const pipeProcess = pipeline(archive, archiveOutput);
			archive.directory(join(import.meta.dir, "../", filePath), false);
			archive.finalize();
			await pipeProcess;
			return new Response(Bun.file(outputPath), {
				headers: {
					"Content-Type": "application/zip",
				},
			});
		} else {
			return new Response(file, {
				headers: {
					"Content-Type": "application/octet-stream",
				},
			});
		}
	})
	.onError(handleError)
	.get("/list/*", async ({ path }) => {
		path = decodeURI(path);
		const folderPath = `storage${path.split("/list")[1] ?? ""}`;
		const files = readdirSync(join(import.meta.dir, "../", folderPath));
		return files.map((file) => {
			const stats = statSync(
				join(import.meta.dir, "../", folderPath, file),
			);
			return {
				name: file,
				size: stats.size,
				isDirectory: stats.isDirectory(),
			};
		});
	})
	.onError(handleError)
	.put(
		"/rename",
		async ({ body, headers }) => {
			const { fstoken } = headers;
			await jwtVerify(fstoken, secret);

			const { from, to } = body;

			try {
				const renamingFile = await Bun.file(`storage${from}`);

				await Bun.write(`storage${to}`, renamingFile);
				unlinkSync(join(import.meta.dir, "../", `storage${from}`));
			} catch (error) {
				return new Response((error as Error).message, {
					status: 400,
				});
			}
		},
		{
			body: t.Object({
				from: t.String(),
				to: t.String(),
			}),
			headers: t.Object({
				fstoken: t.String(),
			}),
		},
	)
	.onError(handleError)
	.delete(
		"/*",
		async ({ path, headers, body }) => {
			path = decodeURI(path);
			const { fstoken } = headers;
			await jwtVerify(fstoken, secret);

			const folderPath = `storage${path}`;
			const { files } = body;
			files.forEach((file) => {
				const fileInfo = statSync(
					join(import.meta.dir, "../", `${folderPath}/${file}`),
				);
				if (fileInfo.isDirectory()) {
					rmdirSync(
						join(import.meta.dir, "../", `${folderPath}/${file}`),
					);
				} else {
					unlinkSync(
						join(import.meta.dir, "../", `${folderPath}/${file}`),
					);
				}
			});
		},
		{
			body: t.Object({
				files: t.Array(t.String()),
			}),
			headers: t.Object({
				fstoken: t.String(),
			}),
		},
	)
	.onError(handleError)
	.post(
		"/*",
		async ({ path, body, headers }) => {
			path = decodeURI(path);
			const { fstoken } = headers;
			await jwtVerify(fstoken, secret);
			try {
				const folderPath = `storage${path}`;
				const { files } = body;
				await Promise.all(
					files.map((file) =>
						Bun.write(`${folderPath}/${file.name}`, file),
					),
				);
			} catch (error) {
				return new Response((error as Error).message, {
					status: 500,
				});
			}
		},
		{
			headers: t.Object({
				fstoken: t.String(),
			}),
			body: t.Object({
				files: t.Files(),
			}),
		},
	)
	.onError(handleError)
	.post(
		"/directory/*",
		async ({ path, headers }) => {
			path = decodeURI(path);
			const { fstoken } = headers;
			await jwtVerify(fstoken, secret);

			const folderPath = `storage${path.split("/directory")[1] ?? ""}`;
			mkdirSync(join(import.meta.dir, "../", `${folderPath}`), {
				recursive: true,
			});
		},
		{
			headers: t.Object({
				fstoken: t.String(),
			}),
		},
	)
	.listen(3000);

export type App = typeof app;

console.log(
	`File server is running at ${app.server?.hostname}:${app.server?.port}`,
);
