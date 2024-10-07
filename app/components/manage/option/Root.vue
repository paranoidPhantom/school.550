<script lang="ts" setup>
import { useClipboard } from "@vueuse/core";

const sectionActive = useCookie("admin_section_root");

const toast = useToast();
const supabase = useSupabaseClient();

const { data: users, refresh: refreshUsers } = await useAsyncData(
	"user_list_sb",
	async () => {
		const { data, error } = await supabase.from("users").select("*");
		if (error) throw error;
		return data;
	},
);

const columns = [
	{ key: "id", label: "ID" },
	{ key: "created_at", label: "Дата создания" },
	{ key: "perms", label: "Роли" },
];

const newRoleInputs = reactive(
	Object.fromEntries((users.value ?? []).map((user) => [user.id, ""])),
);

const addRole = async (uid: string, role: string) => {
	newRoleInputs[uid] = "";
	try {
		await $fetch(`/api/user/${uid}/perms`, {
			method: "POST",
			body: { newPerms: [role] },
		});
		refreshUsers();
	} catch (error) {
		toast.add({
			title: "Ошибка добавления роли",
			description: (error as Error).message,
			color: "red",
		});
	}
};

const removeRole = async (uid: string, role: string) => {
	try {
		await $fetch(`/api/user/${uid}/perms`, {
			method: "DELETE",
			body: { deletePerms: [role] },
			headers: useRequestHeaders(["cookie"]),
		});
		refreshUsers();
	} catch (error) {
		toast.add({
			title: "Ошибка удаления роли",
			description: (error as Error).message,
			color: "red",
		});
	}
};

const { data: invitations, refresh: refreshInvitations } = useFetch(
	"/api/auth/invitation",
	{
		transform: (data) =>
			data.map((invitation: (typeof invitations.value)[number]) => ({
				...invitation,
				perms: invitation["initial-perms"],
			})),
	},
);

const newAdminState = reactive<{
	metadata: Record<string, string>;
	perm: string;
	perms: string[];
	open: boolean;
}>({
	metadata: {
		first_name: "",
		last_name: "",
		middle_name: "",
	},
	perm: "",
	perms: [],
	open: false,
});

const addAdmin = async () => {
	try {
		await $fetch("/api/auth/invitation", {
			method: "POST",
			body: {
				metadata: newAdminState.metadata,
				initialPerms: newAdminState.perms,
			},
		});
	} catch (error) {
		console.error(error as Error);
		toast.add({
			title: "Ошибка приглашения",
			description: (error as Error).message,
			color: "red",
		});
	} finally {
		newAdminState.open = false;
		newAdminState.perms = [];
		newAdminState.perm = "";
		newAdminState.metadata = {
			first_name: "",
			last_name: "",
			middle_name: "",
		};
		refreshInvitations();
	}
};

const invitationColumns = [
	{ key: "id", label: "Ссылка" },
	{ key: "created_at", label: "Дата создания" },
	{ key: "metadata.last_name", label: "Фамилия" },
	{ key: "metadata.first_name", label: "Имя" },
	{ key: "metadata.middle_name", label: "Отчество" },
	{ key: "activated_at", label: "Активировано" },
	{ key: "perms", label: "Стартовые роли" },
];

const {
	public: { site_url },
} = useRuntimeConfig();

const { copy, copied, isSupported, text } = useClipboard();
</script>

<template>
	<div class="flex flex-col gap-4">
		<USlideover v-model="newAdminState.open">
			<UForm @submit="addAdmin" class="space-y-4 p-8">
				<h2 class="text-xl font-semibold">Приглашение админа</h2>
				<hr class="opacity-10" />
				<UFormGroup label="Фамилия" name="last_name" required>
					<UInput v-model="newAdminState.metadata.last_name" />
				</UFormGroup>
				<UFormGroup label="Имя" name="first_name" required>
					<UInput v-model="newAdminState.metadata.first_name" />
				</UFormGroup>
				<UFormGroup label="Отчество" name="middle_name" required>
					<UInput v-model="newAdminState.metadata.middle_name" />
				</UFormGroup>

				<UFormGroup label="Стартовые роли">
					<div class="flex max-w-52 flex-wrap gap-2">
						<TransitionGroup name="fade" mode="out-in">
							<UBadge
								v-for="perm in newAdminState.perms"
								:key="perm"
								variant="soft"
								size="xs"
								:color="useKeyToColor(perm)"
								>{{ perm }}
								<UButton
									v-if="perm !== 'root'"
									size="2xs"
									color="white"
									icon="mdi:close"
									variant="link"
									@click="
										newAdminState.perms =
											newAdminState.perms.filter(
												(val) => val !== perm,
											)
									"
								/>
							</UBadge>
						</TransitionGroup>
						<UButtonGroup size="xs">
							<UInput
								v-model="newAdminState.perm"
								placeholder="Добавить роль"
								@keyup.enter="
									() => {
										if (newAdminState.perm === 'root')
											return;
										newAdminState.perms.push(
											newAdminState.perm,
										);
										newAdminState.perm = '';
									}
								"
							/>
							<UButton
								icon="mdi:plus"
								color="gray"
								:disabled="!newAdminState.perm"
								@click="
									() => {
										if (newAdminState.perm === 'root')
											return;
										newAdminState.perms.push(
											newAdminState.perm,
										);
										newAdminState.perm = '';
									}
								"
							/>
						</UButtonGroup>
					</div>
				</UFormGroup>
				<UButton
					label="Создать приглашение"
					:disabled="
						!newAdminState.metadata.first_name ||
						!newAdminState.metadata.last_name ||
						!newAdminState.metadata.middle_name
					"
					icon="ph:link-simple-duotone"
					type="submit"
				/>
			</UForm>
		</USlideover>
		<UAlert
			title="Корневой пользователь"
			:color="useKeyToColor('root')"
			variant="soft"
			icon="ph:identification-badge-duotone"
			:class="sectionActive ? 'cursor-zoom-out' : 'cursor-zoom-in'"
			@click="sectionActive = sectionActive ? '' : 'true'"
		/>
		<template v-if="sectionActive">
			<h2 class="text-xl font-semibold">Пользователи</h2>
			<UTable :rows="users" :columns="columns">
				<template #created_at-data="{ row }">
					{{ new Date(row.created_at).toLocaleDateString("ru") }}@{{
						new Date(row.created_at).toLocaleTimeString("ru")
					}}
				</template>
				<template #perms-data="{ row }">
					<div class="flex max-w-52 flex-wrap gap-2">
						<TransitionGroup name="fade" mode="out-in">
							<UBadge
								v-for="perm in row.perms"
								:key="perm"
								variant="soft"
								size="xs"
								:color="useKeyToColor(perm)"
								>{{ perm }}
								<UButton
									v-if="perm !== 'root'"
									size="2xs"
									color="white"
									icon="mdi:close"
									variant="link"
									@click="removeRole(row.id, perm)"
								/>
							</UBadge>
						</TransitionGroup>
						<UButtonGroup size="xs">
							<UInput
								v-model="newRoleInputs[row.id]"
								placeholder="Добавить роль"
								@keyup.enter="
									addRole(
										row.id,
										newRoleInputs[row.id] as string,
									)
								"
							/>
							<UButton
								icon="mdi:plus"
								color="gray"
								:disabled="!newRoleInputs[row.id]"
								@click="
									addRole(
										row.id,
										newRoleInputs[row.id] as string,
									)
								"
							/>
						</UButtonGroup>
					</div>
				</template>
			</UTable>
			<hr class="opacity-10" />
			<h2 class="text-xl font-semibold">Приглашения</h2>
			<UTable :rows="invitations" :columns="invitationColumns">
				<template #id-data="{ row }">
					<UBadge v-if="!row.activated_at" variant="subtle" size="xs">
						<span class="text-xs">
							{{ site_url }}/register/{{ row.id }}
						</span>
						<UButton
							v-if="isSupported"
							class="ml-2"
							:padded="false"
							variant="link"
							:icon="
								copied &&
								text === `${site_url}/register/${row.id}`
									? 'mdi:check'
									: 'ic:twotone-content-copy'
							"
							color="white"
							size="xs"
							@click="copy(`${site_url}/register/${row.id}`)"
						/>
					</UBadge>
					<UBadge
						v-else
						variant="subtle"
						color="rose"
						label="Уже активировано"
					/>
				</template>
				<template #created_at-data="{ row }">
					{{ new Date(row.created_at).toLocaleDateString("ru") }}@{{
						new Date(row.created_at).toLocaleTimeString("ru")
					}}
				</template>
				<template #activated_at-data="{ row }">
					{{
						row.activated_at
							? `${new Date(row.created_at).toLocaleDateString("ru")}
						@${new Date(row.created_at).toLocaleTimeString("ru")}`
							: "-"
					}}
				</template>
				<template #perms-data="{ row }">
					<div class="flex max-w-52 flex-wrap gap-2">
						<UBadge
							v-for="perm in row.perms"
							:key="perm"
							variant="soft"
							size="xs"
							:color="useKeyToColor(perm)"
							>{{ perm }}
						</UBadge>
					</div>
				</template>
			</UTable>
			<UButton
				label="Пригласить админа"
				class="w-fit"
				color="white"
				icon="mdi:plus"
				@click="newAdminState.open = true"
			/>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition: all 1s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
