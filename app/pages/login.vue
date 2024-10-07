<script setup lang="ts">
import type { RouteLocationRaw } from "#vue-router";
definePageMeta({
	name: "Авторизация",
});

const toast = useToast();

const { auth } = useSupabaseClient();

const waitingForRes = ref(false);
const {
	query: { callback, message },
} = useRoute();
const state = ref<{
	email: string | undefined;
	password: string | undefined;
	error: string | undefined;
}>({
	email: undefined,
	password: undefined,
	error: undefined,
});
const validate = (
	stateParam: typeof state.value,
): { path: string; message: string }[] => {
	const errors = [];
	if (!stateParam.email)
		errors.push({ path: "email", message: "Обязательное поле" });
	if (!stateParam.password)
		errors.push({ path: "password", message: "Обязательное поле" });
	return errors;
};

async function submit() {
	waitingForRes.value = true;
	if (!state.value.email || !state.value.password) {
		return;
	}
	const { error } = await auth.signInWithPassword({
		email: state.value.email,
		password: state.value.password,
	});
	if (!error) {
		toast.add({
			id: "auth_event",
			title: "Вы успешно вошли",
			icon: "i-heroicons-check-circle",
			timeout: 3000,
		});
		navigateTo(callback ? (callback as RouteLocationRaw) : "/manage");
		return;
	}
	waitingForRes.value = false;
	console.warn(error.message);
	switch (error.status) {
		case 401: {
			state.value.error = "Неверные данные";
			break;
		}
		default: {
			toast.add({
				id: "auth_error",
				title: "Ошибка авторизации",
				message: error.message,
				icon: "i-heroicons-exclamation-circle",
				timeout: 3000,
			});
		}
	}
}
</script>

<template>
	<section class="__login">
		<UForm :validate="validate" :state="state" @submit="submit">
			<UIcon
				name="clarity:employee-line"
				class="animate-pulse text-4xl"
			/>
			<h1>Вход</h1>
			<UAlert
				v-if="message && message !== 'undefined'"
				icon="i-heroicons-lock-closed"
				color="primary"
				variant="subtle"
				:title="message as string"
			/>
			<hr class="w-1/2 opacity-10" />
			<UFormGroup label="Email" name="email">
				<UInput v-model="state.email" placeholder="email@example.ru" />
			</UFormGroup>
			<UFormGroup label="Пароль" name="password" :error="state.error">
				<UInput v-model="state.password" type="password" />
			</UFormGroup>
			<UButton
				type="submit"
				:disabled="!state.email || !state.password"
				:loading="waitingForRes"
			>
				Войти
			</UButton>
		</UForm>
	</section>
</template>

<style scoped lang="scss">
.__login {
	display: flex;
	justify-content: center;
	form {
		--form-width: 36rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		width: calc(var(--form-width) - 2rem);
		max-width: 90%;
		padding: 2rem 1rem;
		margin: 1rem min(5%, calc((100% - var(--form-width)) / 2));
		box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.5);
		border-radius: 1rem;
		h1 {
			font-weight: 700;
			font-size: 1.5rem;
		}
	}
}
</style>
