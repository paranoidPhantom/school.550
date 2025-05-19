import { defineNuxtPlugin } from "#app";
import posthog from "posthog-js";
export default defineNuxtPlugin((nuxtApp) => {
	const runtimeConfig = useRuntimeConfig();
	if (posthog) {
		const posthogClient = posthog.init(
			runtimeConfig.public.posthogPublicKey,
			{
				api_host: import.meta.dev
					? "http://127.0.0.1/ingest"
					: runtimeConfig.public.posthogHost,
				person_profiles: "always", // or 'always' to create profiles for anonymous users as well
				capture_pageview: false, // we add manual pageview capturing below
				loaded: (posthog) => {
					if (import.meta.env.MODE === "development") posthog.debug();
				},
			},
		);

		// Make sure that pageviews are captured with each route change
		const router = useRouter();
		router.afterEach((to) => {
			nextTick(() => {
				posthog.capture("$pageview", {
					current_url: to.fullPath,
				});
			});
		});

		return {
			provide: {
				posthog: () => posthogClient,
			},
		};
	}
});
