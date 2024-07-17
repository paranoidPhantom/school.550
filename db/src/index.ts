import { unlinkSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwtVerify } from "jose";

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
    .get(
        "/list/*",
        async ({ path, headers }) => {
            const { fstoken } = headers;
            await jwtVerify(fstoken, secret);

            const folderPath = `storage${path.split("/list")[1] ?? ""}`;
            const files = readdirSync(join(import.meta.dir, "../", folderPath));
            return files.map((file) => {
                const stats = statSync(
                    join(import.meta.dir, "../", folderPath, file)
                );
                return {
                    name: file,
                    size: stats.size,
                    isDirectory: stats.isDirectory(),
                };
            });
        },
        {
            headers: t.Object({
                fstoken: t.String(),
            }),
        }
    )
    .onError(handleError)
    .put(
        "/rename",
        async ({ path, body, headers }) => {
            const { fstoken } = headers;
            await jwtVerify(fstoken, secret);

            const { from, to } = body;

            const renamingFile = Bun.file(`storage${from}`);
            Bun.write(`storage${to}`, renamingFile);
            unlinkSync(join(import.meta.dir, "../", `storage${from}`));
        },
        {
            body: t.Object({
                from: t.String(),
                to: t.String(),
            }),
            headers: t.Object({
                fstoken: t.String(),
            }),
        }
    )
    .onError(handleError)
    .delete(
        "/*",
        async ({ path, headers, body }) => {
            const { fstoken } = headers;
            await jwtVerify(fstoken, secret);

            const folderPath = `storage${path}`;
            const { files } = body;
            files.forEach((file) =>
                unlinkSync(
                    join(import.meta.dir, "../", `${folderPath}/${file}`)
                )
            );
        },
        {
            body: t.Object({
                files: t.Array(t.String()),
            }),
            headers: t.Object({
                fstoken: t.String(),
            }),
        }
    )
    .onError(handleError)
    .post(
        "/*",
        async ({ path, body, headers }) => {
            const { fstoken } = headers;
            await jwtVerify(fstoken, secret);

            const folderPath = `storage${path}`;
            const { files } = body;
            files.forEach((file) =>
                Bun.write(`${folderPath}/${file.name}`, file)
            );
        },
        {
            headers: t.Object({
                fstoken: t.String(),
            }),
            body: t.Object({
                files: t.Files(),
            }),
        }
    )
    .listen(3000);

export type App = typeof app;

console.log(
    `File server is running at ${app.server?.hostname}:${app.server?.port}`
);
