<script lang="ts" setup>
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
</script>

<template>
	<div class="flex flex-col gap-4">
		<UAlert
			title="Корневой пользователь"
			:color="useKeyToColor('root')"
			variant="soft"
			icon="ph:identification-badge-duotone"
			:class="sectionActive ? 'cursor-zoom-out' : 'cursor-zoom-in'"
			@click="sectionActive = sectionActive ? '' : 'true'"
		/>
		<template v-if="sectionActive">
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
