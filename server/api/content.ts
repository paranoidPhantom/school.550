import type { Database } from "~~/supabase/types";
import { serverSupabaseServiceRole } from "#supabase/server";

const fmtRouteKey = (route: string) => route.replaceAll('/','_');

export default defineCachedEventHandler(
	async (event) => {
    const query = getQuery(event);
    if (!query?.route) {
          throw createError({ status: 400, message: "<route> param not passed" });
    }
    const route = query["route"] as string;
		const supabase = serverSupabaseServiceRole<Database>(event);
    if (!["GET", "DELETE"].includes(event.method)) {
      throw createError({ status: 405, message: "Method not allowed" });
    }
    switch (event.method) {
      case "GET":
        try {
          const { data } = await supabase
            .from("content")
            .select("slug, md, restricted")
            .eq("slug", route)
            .maybeSingle();
          if (data) {
            if (data.restricted) {
              throw createError({ status: 401, message: "Unauthorized" });
            }
            return data.md;
          } else {
              throw createError({ status: 404, message: "Page not found" });
          }
        } catch (error) {
          console.error("Content fetch error:", error);
          throw error;
        }
        break;
      case "DELETE":
        console.log("Invalidating cache for content:", route);
        await useStorage('cache').removeItem(`nitro:handlers:contentSource:${fmtRouteKey(route)}.json`)
        break;
    }
	},
	{
		maxAge: , // Page cached for 48 hours
    name: "contentSource",
    getKey: (event) => {
      const query = getQuery(event);
      if (!query?.route) {
        throw createError({ status: 400, message: "<route> param not passed" });
      }
      return event.method === "GET" ? fmtRouteKey(query.route) : `cacheInvalidation_${Date.now()}`;
    }
	},
);
