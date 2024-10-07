<script lang="ts" setup></script>

<template>
	<div class="__md-formatter">
		<slot />
	</div>
</template>

<style lang="scss">
.__md-formatter > div {
	> * {
		@apply mb-4;
	}
	h1 {
		@apply text-2xl font-bold opacity-100 sm:text-3xl;
	}
	h2 {
		@apply text-xl font-semibold opacity-100 sm:text-2xl;
	}
	h3 {
		@apply text-lg font-semibold opacity-90 sm:text-xl;
	}
	h4 {
		@apply text-base font-normal opacity-90 sm:text-lg;
	}
	h5 {
		@apply text-sm font-normal opacity-80 sm:text-base;
	}
	h6 {
		@apply text-sm font-normal opacity-80;
	}
	p {
		@apply opacity-80;
	}
	ul {
		li {
			@apply ml-6 list-disc;
		}
	}
	ol {
		li {
			@apply ml-6 list-decimal;
		}
	}
	blockquote {
		@apply rounded-l-md border-l-4 border-gray-400 pl-4 opacity-70;
	}
	table {
		@apply overflow-hidden rounded-xl outline outline-1 outline-gray-400 dark:outline-gray-600;
		thead {
			@apply text-left;
			th {
				@apply rounded-xl border border-gray-400 border-opacity-50 px-4 py-2;
			}
		}
		tbody {
			td {
				@apply border border-gray-400 border-opacity-40 px-4 py-2;
			}
		}
	}
	a {
		@apply relative text-sky-500 dark:text-sky-400;
		&:hover {
			@apply text-sky-600 dark:text-sky-500;
		}
	}
	hr {
		@apply dark:opacity-20;
	}
}
</style>
