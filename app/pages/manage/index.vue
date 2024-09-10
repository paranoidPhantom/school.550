<script lang="ts" setup>
definePageMeta({
	layout: "manage",
});

const { user, logout: clearCredentials } = useTelegramUser();

const { data: perms } = await useFetch("/api/auth/perms");

const logout = () => {
	clearCredentials();
	window.location.reload();
};

// Extra protective layer (can be bypassed easily but mainly here to not show the option to devs who don't need it)
const kvEditors = [5491328220];
</script>

<template>
	<div class="__manage p-4">
		<UCard v-if="user">
			<template #header>
				<div class="flex items-center gap-4">
					<UAvatar
						:src="user.photo_url"
						icon="line-md:account"
						size="xl"
					/>
					<div class="flex flex-col">
						<h2 class="text-xl">
							{{ user.first_name }} {{ user.last_name }}
						</h2>
						<p class="text-xs opacity-50">
							@{{ user.username }} - {{ user.id }}
						</p>
					</div>
					<UButton
						class="ml-auto"
						icon="line-md:logout"
						variant="ghost"
						color="white"
						size="xl"
						@click="logout"
					/>
				</div>
			</template>
			<DevOnly v-if="kvEditors.includes(user.id)">
				<ManageOptionKVEditor />
			</DevOnly>
			<UAlert
				v-if="perms.length === 0"
				title="У вас пока нет доступа ни к одной части сайта"
				color="yellow"
				variant="subtle"
				icon="line-md:alert-loop"
			>
				<template #description>
					<p class="text-sm">
						Чтобы получить права необходимо обратиться к
						администратору сайта и сообщить свой ID -
						<UBadge variant="subtle" color="yellow">
							{{ user.id }}</UBadge
						>
					</p>
				</template>
			</UAlert>
			<div v-else class="flex flex-col gap-4">
				<ManageOptionRoot v-if="perms.includes('root')" />
				<ManageOptionContent v-if="perms.includes('edit_content')" />
				<ManageOptionFS v-if="perms.includes('fs')" />
			</div>
		</UCard>
	</div>
</template>

<style lang="scss" scoped></style>
