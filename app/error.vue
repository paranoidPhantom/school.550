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
				class="a hidden transition-all sm:block"
				src="/images/question_mark.svg"
			/>
			<NuxtImg
				:style="`translate: ${displacement.x}% ${displacement.y}%;`"
				class="b transition-all"
				src="/images/question_mark.svg"
			/>
		</div>
		<div class="error-wrapper">
			<h1 class="text-center">
				<span v-for="c in barcode" :key="c">{{ c }}</span>
			</h1>
			<p class="text-center opacity-50">{{ comment }}</p>
			<UButton size="lg" to="/" label="На главную" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.__error {
	height: 100vh;
	position: relative;
	h1 {
		font-size: 5rem;
		font-weight: 200;
		font-family: "Libre Barcode 128 Text" sans-serif;
		color: rgb(var(--color-primary-DEFAULT));
		user-select: none;

		span {
			&:hover {
				font-weight: 900;
			}
			&:active {
				@apply text-red-500;
			}
		}
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
