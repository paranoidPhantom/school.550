<script lang="ts" setup>
import { useMouse, useWindowSize } from "@vueuse/core";
const isServer = import.meta.server;

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
		<NuxtPicture
			src="/images/gradient.png"
			alt="Фон"
			width="1920"
			sizes="sm:100vw md:100vw lg:100vw"
			quality="10"
			fit="contain"
			:img-attrs="{ class: 'h-screen object-cover' }"
			class="absolute left-0 top-0 -z-20 h-screen w-full object-cover blur-md"
		/>
		<NuxtPicture
			src="/images/noise.png"
			class="static-noise absolute left-0 top-0 -z-10 w-full object-cover opacity-20"
			width="1920"
			sizes="sm:100vw md:100vw lg:100vw"
			quality="10"
			fit="cover"
			:img-attrs="{
				style: 'height: calc(100vh + 5px)',
				class: 'object-cover',
			}"
			style="height: calc(100vh + 5px)"
		/>
		<NuxtPicture
			src="/images/noise.png"
			class="dynamic-noise pointer-events-none absolute left-0 top-0 z-10 w-full object-cover opacity-20"
			width="1920"
			sizes="sm:100vw md:100vw lg:100vw"
			quality="10"
			fit="cover"
			:img-attrs="{
				style: 'height: calc(100vh + 5px)',
				class: 'object-cover',
			}"
			style="height: calc(100vh + 5px)"
			:style="{ '--x': x + 'px', '--y': y + 'px' }"
		/>
		<!-- Hero -->
		<div v-show="!isServer" class="flex flex-col items-center gap-2">
			<!-- Line 1 -->
			<div class="flex max-w-full flex-wrap gap-5" data-aos="fade-right">
				<h1
					class="gradient text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
					style="animation-delay: 1.84s"
				>
					Школа
				</h1>
				<img
					src="/images/school_compact.png"
					alt="Школа"
					sizes="sm:75 md:90 lg:120"
					class="hidden rounded-full sm:block sm:h-12 md:h-14 lg:h-20"
				/>
			</div>
			<!-- Line 2 -->
			<div class="flex flex-wrap gap-5" data-aos="fade-left">
				<h1
					class="gradient text-md sm:text-2xl md:text-3xl lg:text-4xl"
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
			<div class="flex flex-wrap gap-5" data-aos="fade-right">
				<div
					class="hidden items-center justify-center rounded-full bg-white px-4 py-2 sm:flex sm:h-12 md:h-14 lg:h-20"
				>
					<img
						class="h-2/3"
						src="/images/ort.png"
						sizes="sm:65 md:80 lg:130"
						alt="ORT"
					/>
				</div>
				<h1
					class="gradient text-6xl md:text-7xl lg:text-8xl"
					style="animation-delay: 0.67s"
				>
					550
				</h1>
			</div>
		</div>
		<div v-show="isServer" class="flex items-center justify-center">
			<UIcon
				name="svg-spinners:blocks-wave"
				class="text-4xl text-white opacity-70 blur-[1px]"
			/>
		</div>
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
				>
					<UIcon name="icon-park-outline:telegram" />
				</UButton>
				<UButton
					variant="solid"
					color="gray"
					to="https://vk.com/school_550_spb"
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

.__home {
	.hero {
		@apply w-full;
		padding-bottom: calc(80px + 1.8rem);
		height: calc(100vh - 80px + 3rem);

		.gradient {
			font-family: Akony, sans-serif;
			text-transform: uppercase;
			background: linear-gradient(to right, #ffffff 16%, #b8d4ff);
			-webkit-text-fill-color: transparent;
			-webkit-background-clip: text;
			background-clip: text;
			text-align: center;
			animation: scale 3s infinite ease-in-out;
		}

		.static-noise {
			--image: linear-gradient(to bottom, black, black 90%, transparent);
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
