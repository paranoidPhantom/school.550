// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	nitro: {
		prerender: {
			concurrency: 1,
		},
	},

	ogImage: {
		enabled: false,
	},

	devServer: {
		port: 80,
		host: "0.0.0.0",
	},

	devtools: { enabled: true },

	monacoEditor: {
		locale: "ru",
	},

	mdc: {
		headings: {
			anchorLinks: false,
		},
	},

	modules: [
		"nuxt-aos",
		"nuxt-monaco-editor",
		"@nuxt/ui",
		"@nuxt/fonts",
		"@nuxt/eslint",
		"@nuxtjs/seo",
		"@nuxtjs/supabase",
		"@nuxtjs/mdc",
		"@artmizu/nuxt-prometheus",
	],

	routeRules: {
		"/": { swr: 60 },
		"/news/**": { swr: 60 },
		"/info/**": { swr: 60 },
		"/for-parents/**": { swr: 60 },
		"/manage": { robots: false },
		"/manage/**": { robots: false },
		"/ingest/static/**": {
			proxy: "https://us-assets.i.posthog.com/static/**",
		},
		"/ingest/**": { proxy: "https://us.i.posthog.com/**" },
	},

	sitemap: {
		sources: ["/api/sitemap/content"],
	},

	app: {
		layoutTransition: { name: "layout", mode: "out-in" },
		pageTransition: { name: "page", mode: "out-in" },
	},

	css: ["./app/assets/style.scss"],

	future: {
		compatibilityVersion: 4,
	},
	components: {
		dirs: ["~/components/content", "~/components"],
		global: true,
	},

	site: {
		url: process.env.SITE_URL,
		name: "Школа №550",
		description: "Официальный портал школы №550",
		defaultLocale: "ru",
	},

	runtimeConfig: {
		public: {
			site_url: process.env.SITE_URL,
			environment: process.env.NODE_ENV,
			file_server_url: process.env.FILE_SERVER_URL,
			posthogPublicKey: "phc_VA3CJoIS41f8R0luXa1qnxQDmCa4XWsU4uaTdOlMfU9",
			posthogHost: `${process.env.SITE_URL}/ingest`,
		},
	},

	supabase: {
		url: process.env.SUPABASE_PUBLIC_URL,
		key: process.env.ANON_KEY,
		serviceKey: process.env.SERVICE_ROLE_KEY,
		types: "./supabase/types.ts",
		redirectOptions: {
			include: ["/manage(/*)?"],
			login: "/login",
			callback: "/test",
		},
		cookieOptions: {
			secure: false,
		},
	},

	compatibilityDate: "2024-07-17",
});
