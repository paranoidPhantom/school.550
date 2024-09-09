// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	nitro: {
		storage: {
			default: {
				driver: "cloudflare-kv-http",
				accountId: process.env.KV_ACCOUND_ID,
				namespaceId: process.env.KV_NAMESPACE_ID,
				apiToken: process.env.KV_API_TOKEN,
			},
		},
	},

	experimental: {
		componentIslands: true,
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

	mdc: {
		headings: {
			anchorLinks: false,
		},
	},
	content: {
		markdown: {
			anchorLinks: false,
		},
	},

	modules: [
		"nuxt-aos",
		"@paranoidphantom/tgauth",
		"nuxt-monaco-editor",
		"@nuxt/ui",
		"@nuxt/fonts",
		"@nuxt/image",
		"@nuxt/content",
		"@nuxt/eslint",
		"@nuxtjs/seo",
		"@nuxtjs/mdc",
		"@nuxtjs/algolia",
	],

	image: {
		domains: ["db.portal.ort.spb.ru"],
		formats: ["avif", "webp"],
	},

	routeRules: {
		"/": { isr: 60 },
		"/info/**": { isr: 60 },
		"/for-parents/**": { isr: 60 },
		"/manage/**": { robots: false, isr: false },
	},

	sitemap: {
		sources: ["/api/sitemap/content"],
	},

	app: {
		layoutTransition: { name: "layout", mode: "out-in" },
		pageTransition: { name: "page", mode: "out-in" },
	},

	algolia: {
		instantSearch: {
			theme: "algolia",
		},
	},

	css: ["@/assets/style.scss"],

	site: {
		url: process.env.SITE_URL,
		name: "Школа №550",
		description: "Официальный портал школы №550",
		defaultLocale: "ru",
	},

	future: {
		compatibilityVersion: 4,
	},

	tgauth: {
		auth_expiration: 0,
	},

	runtimeConfig: {
		public: {
			tgbot: process.env.TG_BOT,
			environment: process.env.NODE_ENV,
			file_server_url: process.env.FILE_SERVER_URL,
		},
	},

	compatibilityDate: "2024-07-17",
});
