<script setup lang="ts">
import type { NuxtError } from "#app";
import { useMouse } from "@vueuse/core";

const { error } = defineProps<{
	error: NuxtError;
}>();
const comment = ref();

switch (error.statusCode) {
	case 404: {
		comment.value = `Страница, которую вы ищите, не существует. Возможно, она была перемещена или удалена.`;
		break;
	}
	case 500: {
		comment.value = `Возникла серверная ошибка (не гуд). Самое время настучать по голове Андрею...`;
		break;
	}
}

const { x, y } = useMouse();

const sensetivity = -100;

const displacement = computed(() => {
	if (!document) return { x: 0, y: 0 };
	return {
		x: (x.value - document.documentElement.clientWidth / 2) / sensetivity,
		y: (y.value - document.documentElement.clientHeight / 2) / sensetivity,
	};
});

const barcode = computed(() => `${error.statusCode} ${error.message}`);
</script>

<template>
	<div class="__error">
		<div class="creative-block">
			<NuxtImg
				:style="`translate: ${displacement.x}% ${displacement.y}%;`"
				class="a hidden sm:block"
				src="/images/question_mark.svg"
			/>
			<NuxtImg
				:style="`translate: ${displacement.x}% ${displacement.y}%;`"
				class="b"
				src="/images/question_mark.svg"
			/>
		</div>
		<div class="error-wrapper">
			<h1 class="text-center">
				<span
					v-for="(c, index) in barcode"
					:key="c"
					:style="`animation-delay: ${index * 0.1}s`"
					>{{ c }}</span
				>
			</h1>
			<p class="text-center opacity-50">{{ comment }}</p>
			<UButton size="lg" to="/" variant="link" :padded="false"
				><UBadge variant="subtle" label="На главную" size="lg" />
			</UButton>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.__error {
	height: 100vh;
	position: relative;
	@keyframes letter {
		0% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
			font-size: 1.1em;
		}
		100% {
			opacity: 0.5;
		}
	}
	h1 {
		font-size: 2rem;
		font-weight: 300;
		font-family: "Source Code Pro", sans-serif;
		max-width: 70%;
		color: rgb(var(--color-primary-DEFAULT));
		span {
			animation: letter 1s infinite 1s;
		}
	}
	p {
		font-family: "Source Code Pro", sans-serif;
		font-weight: 200;
	}
	.error-wrapper {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		z-index: 3;
	}
	.creative-block {
		position: fixed;
		overflow: hidden;
		inset: 0;
		img {
			position: absolute;
			&.a {
				left: 10%;
				top: 500px;
				rotate: -20deg;
				scale: 0.7;
			}
			&.b {
				right: 10%;
				top: 200px;
			}
		}
	}
}
</style>
