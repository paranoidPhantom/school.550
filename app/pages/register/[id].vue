<script lang="ts" setup>
definePageMeta({
	title: "Регистрация",
	middleware: ["registration"],
});

const supabase = useSupabaseClient();

const { metadata, id } = useRoute().meta as {
	metadata: Record<string, string>;
	id: string;
};

const toast = useToast();

const email = ref("");
const password = ref("");
const passwordConfirm = ref("");

const loading = ref(false);

const router = useRouter();

const step = ref(1);

const register = async () => {
	loading.value = true;
	try {
		await $fetch("/api/auth/registration", {
			method: "POST",
			body: {
				email: email.value,
				password: password.value,
			},
			query: { id },
		});
		await supabase.auth.signInWithPassword({
			email: email.value,
			password: password.value,
		});
		toast.add({
			color: "green",
			icon: "mdi:check-circle-outline",
			title: "Регистрация успешна",
		});
		router.push("/manage");
	} catch (error) {
		console.error(error as Error);
		toast.add({
			color: "red",
			icon: "mdi:alert-circle-outline",
			title: "Ошибка регистрации",
			description: (error as Error).message,
		});
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<div class="__register">
		<UCard v-if="metadata" class="mx-auto max-w-[600px]">
			<div v-if="step === 1" class="space-y-4">
				<h1 class="text-2xl font-semibold">
					{{
						metadata.first_name
							? `Добрый день, ${metadata.first_name}!`
							: `Добрый день!`
					}}
				</h1>
				<hr class="my-4 opacity-10" />
				<p class="opacity-80">
					Вас пригласили стать администратором сайта
				</p>
				<UButton
					@click="step++"
					trailing-icon="mdi:arrow-right"
					color="white"
					>Начать регистрацию</UButton
				>
			</div>
			<div v-else-if="step === 2" class="space-y-4">
				<h1 class="text-2xl font-semibold">
					Подтвердите правильность данных
				</h1>
				<hr class="my-4 opacity-10" />
				<UCard class="mx-auto max-w-[300px] p-4">
					<div class="flex flex-col items-center gap-8">
						<UIcon name="clarity:employee-line" class="text-5xl" />
						<p class="animate-bounce text-center text-xl">
							{{ metadata.last_name }} {{ metadata.first_name }}
							{{ metadata.middle_name }}
						</p>
					</div>
				</UCard>
				<div class="flex gap-2">
					<UButton
						color="white"
						icon="mdi:arrow-left"
						@click="step--"
					/>
					<UButton
						@click="step++"
						trailing-icon="mdi:arrow-right"
						color="white"
						>Всё верно</UButton
					>
				</div>
			</div>
			<div v-else-if="step === 3" class="space-y-4">
				<h1 class="text-2xl font-semibold">Введите данные для входа</h1>
				<hr class="my-4 opacity-10" />
				<UForm @submit="register" class="space-y-4">
					<UFormGroup label="Почта" required>
						<UInput
							id="email"
							v-model="email"
							type="email"
							placeholder="pochta@example.ru"
						/>
					</UFormGroup>
					<UFormGroup label="Пароль" required>
						<UInput
							id="password"
							v-model="password"
							type="password"
						/>
					</UFormGroup>
					<UFormGroup label="Подтверждение пароля" required>
						<UInput
							id="password-confirm"
							v-model="passwordConfirm"
							type="password"
						/>
					</UFormGroup>
					<div class="flex gap-2">
						<UButton
							color="white"
							icon="mdi:arrow-left"
							@click="step--"
						/>
						<UButton
							:loading="loading"
							:disabled="
								loading ||
								!email ||
								!password ||
								!passwordConfirm ||
								password !== passwordConfirm
							"
							type="submit"
							icon="mdi:check"
							color="white"
							>Зарегистрироваться</UButton
						>
					</div>
				</UForm>
			</div>
		</UCard>
	</div>
</template>

<style lang="scss" scoped></style>
