<script lang="ts" setup>
import { useMouse } from "@vueuse/core";

const suffix = "|";
const suffixActive = ref(true);

onMounted(() => {
	setInterval(() => {
		suffixActive.value = !suffixActive.value;
	}, 500);
});

const { x, y } = useMouse();
</script>

<template>
	<section
		class="hero flex select-none items-center justify-center overflow-hidden"
	>
		<div
			class="hero-bg absolute inset-0 -z-10 overflow-hidden bg-[#295FF5]"
		>
			<div class="shapes absolute left-0 top-0 h-full w-full">
				<div
					class="aspect-1 circle absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00F0FF]"
				/>
				<div
					class="aspect-1 circle absolute bottom-0 left-40 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#F046FF]"
				/>
				<div
					class="aspect-1 circle 64translate-x-1/2 absolute bottom-1/2 right-40 translate-y-1/2 rounded-full bg-[#20FFCB] lg:bottom-0"
				/>
			</div>
			<div
				class="overlay absolute inset-0 bg-white bg-opacity-30 backdrop-blur-[200px] md:backdrop-blur-[400px]"
			/>
		</div>
		<NuxtPicture
			src="/images/noise.png"
			loading="lazy"
			alt="Текустура шума"
			preload
			class="static-noise absolute left-0 top-0 -z-10 w-full object-cover opacity-20"
			width="4000"
			sizes="sm:100vw md:100vw lg:100vw"
			quality="10"
			fotmat="avif, webp"
			fit="cover"
			:img-attrs="{
				style: 'height: calc(100vh + 5px)',
				class: 'object-cover',
			}"
			style="height: calc(100vh + 5px)"
		/>
		<NuxtPicture
			src="/images/noise.png"
			alt="Динамичная текустура шума"
			loading="lazy"
			class="dynamic-noise pointer-events-none absolute left-0 top-0 z-10 w-full object-cover opacity-20"
			width="4000"
			sizes="sm:100vw md:100vw lg:100vw"
			quality="10"
			fotmat="avif, webp"
			fit="cover"
			:img-attrs="{
				style: 'height: calc(100vh + 5px)',
				class: 'object-cover',
			}"
			style="height: calc(100vh + 5px)"
			:style="{ '--x': x + 'px', '--y': y + 'px' }"
		/>
		<!-- Hero -->
		<div class="animate-fade-in flex flex-col items-center gap-2">
			<!-- Line 1 -->
			<div class="flex max-w-full flex-wrap gap-5">
				<h1
					class="large text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
					style="animation-delay: 1.84s"
				>
					Школа
				</h1>
			</div>
			<!-- Line 2 -->
			<div class="flex flex-wrap gap-5">
				<h1
					class="large text-md sm:text-2xl md:text-3xl lg:text-4xl"
					style="animation-delay: 2.74s"
				>
					Информационных технологий<span
						class="ml-1"
						:style="{ opacity: suffixActive ? 1 : 0 }"
					>
						{{ suffix }}</span
					>
				</h1>
			</div>
			<!-- Line 3 -->
			<div class="flex flex-wrap gap-5">
				<h1
					class="large text-6xl md:text-7xl lg:text-8xl"
					style="animation-delay: 0.67s"
				>
					550
				</h1>
			</div>
		</div>
		<!-- <div v-show="isServer" class="flex items-center justify-center">
			<UIcon
				name="svg-spinners:blocks-wave"
				class="text-4xl text-white opacity-70 blur-[1px]"
			/>
		</div> -->
		<div
			class="hero-links absolute bottom-0 flex w-full max-w-[1200px] justify-between p-4 pb-8 opacity-80 sm:p-6 md:p-8"
		>
			<div class="flex flex-wrap gap-x-4 gap-y-2">
				<UButton variant="solid" color="gray" to="#location"
					>Торговый переулок, 2А</UButton
				>
				<UButton
					variant="solid"
					color="gray"
					to="tel:+7 (812) 315-50-60"
					>+7 (812) 315-50-60</UButton
				>
			</div>
			<div class="ml-8 flex flex-wrap justify-end gap-x-4 gap-y-2">
				<UButton
					variant="solid"
					color="gray"
					to="https://t.me/school550_spb"
					aria-label="Канал в Telegram"
				>
					<UIcon name="icon-park-outline:telegram" />
				</UButton>
				<UButton
					variant="solid"
					color="gray"
					to="https://vk.com/school_550_spb"
					aria-label="Группа в ВКонтакте"
				>
					<UIcon name="entypo-social:vk" />
				</UButton>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@keyframes scale {
	0% {
		scale: 1 1;
	}

	50% {
		scale: 0.95 1;
	}

	100% {
		scale: 1 1;
	}
}

@keyframes fade {
	0% {
		opacity: 0;
	}
	50% {
		opacity: 0;
		scale: 0.9;
	}
	100% {
		opacity: 1;
		scale: 1;
	}
}

@keyframes shapes {
	0% {
		rotate: 0deg;
	}
	100% {
		rotate: 360deg;
	}
}

.__home {
	.shapes {
		--unit: max(50vw, 50vh);

		animation: shapes 10s forwards linear infinite;
		.circle {
			width: var(--unit);
			height: var(--unit);
			translate: 20% -10%;
		}
	}
	.hero {
		@apply w-full;
		padding-bottom: calc(80px + 1.8rem);
		height: calc(100vh - 80px + 3rem);

		.animate-fade-in {
			animation: fade 0.5s forwards ease-in-out;
		}

		.large {
			font-family: "Akony", "Arial Black";
			font-weight: 900;
			text-transform: uppercase;
			background: white;
			-webkit-text-fill-color: transparent;
			-webkit-background-clip: text;
			background-clip: text;
			text-align: center;
			animation: scale 3s infinite ease-in-out;
		}

		.static-noise,
		.hero-bg {
			--image: linear-gradient(to bottom, black, black 98%, transparent);
			mask-image: var(--image);
		}

		.dynamic-noise {
			--image: radial-gradient(
					circle 200px at var(--x) var(--y),
					black 0,
					transparent 100%
				),
				linear-gradient(to bottom, black, black 90%, transparent);
			-webkit-mask-image: var(--image);
			mask-image: var(--image);
			-webkit-mask-composite: intersect;
			mask-composite: intersect;

			@supports not (mask-composite: intersect) {
				--image: radial-gradient(
					circle 200px at var(--x) var(--y),
					black 0,
					transparent 100%
				);
			}
		}
	}
}
</style>
