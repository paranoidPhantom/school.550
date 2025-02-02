// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	experimental: {
		componentIslands: true,
	},

	nitro: {
		prerender: {
			concurrency: 1,
		},
	},

	devServer: {
		port: 80,
		host: "0.0.0.0",
	},

	devtools: { enabled: true },

	monacoEditor: {
		// These are default values:
		locale: "ru",
	},

	content: {
		markdown: {
			anchorLinks: false,
		},
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
		"@nuxt/content",
		"@nuxt/mdc",
	],

	routeRules: {
		// "/": { swr: 60 },
		// "/news/**": { swr: 60 },
		// "/info/**": { swr: 60 },
		// "/for-parents/**": { swr: 60 },
		"/manage": { robots: false, isr: false },
		"/manage/**": { robots: false, isr: false },
	},

	sitemap: {
		sources: ["/api/sitemap/content"],
	},

	app: {
		layoutTransition: { name: "layout", mode: "out-in" },
		pageTransition: { name: "page", mode: "out-in" },
	},

	css: ["./app/assets/style.scss"],

	site: {
		url: process.env.SITE_URL,
		name: "Школа №550",
		description: "Официальный портал школы №550",
		defaultLocale: "ru",
	},

	future: {
		compatibilityVersion: 4,
	},

	runtimeConfig: {
		public: {
			site_url: process.env.SITE_URL,
			environment: process.env.NODE_ENV,
			file_server_url: process.env.FILE_SERVER_URL,
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
