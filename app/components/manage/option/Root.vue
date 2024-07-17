<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
import type { Role } from "~~/server/types/role";
const toast = useToast();

const sectionActive = useCookie("admin_section_root");

// ROLES
const { data: roles, refresh: refreshRoles } = await useFetch("/api/roles");

const newRoleState = reactive({ key: "", description: "" });

const createRole = async (key: string, description: string) => {
    try {
        if (!key || !description) return;
        await $fetch("/api/roles", {
            method: "POST",
            body: { key, description },
        });
        if (roles.value) {
            roles.value.push({ key, description });
            newRoleState.key = "";
            newRoleState.description = "";
            toast.add({
                title: "Успешно",
                description: "Роль успешно создана",
                color: "green",
            });
            refreshRoles();
        }
    } catch (error) {
        toast.add({
            title: "Ошибка",
            description: (error as Error).message,
            color: "red",
        });
    }
};

// USERS
const { data: users, refresh: refreshUsers } = await useFetch("/api/users");

const userActionState = reactive<{
    add: boolean;
    edit: boolean;
    uid: string | number;
}>({ add: false, edit: false, uid: "" });

const popoverActive = ref(false);

const idValid = computed(
    () => userActionState.uid && !Number.isNaN(Number(userActionState.uid))
);

const userFromId = computedAsync(async () => {
    if (!idValid.value) return null;
    return await $fetch(`/api/user/${userActionState.uid}`);
}, null);

const createUser = async () => {
    try {
        if (!userActionState.uid || !userFromId.value) return;
        await $fetch("/api/users", {
            method: "POST",
            body: userFromId.value,
        });
		refreshUsers();
        userActionState.uid = Number(userFromId.value.id);
		userActionState.edit = true;
		userActionState.add = false;
		toast.add({
            title: "Успешно",
            description: "Пользователь успешно создан",
            color: "green",
        });

    } catch (error) {
        toast.add({
            title: "Ошибка",
            description: (error as Error).message,
            color: "red",
        });
    }
};

const now = Date.now();

const userOptions = computed(() => {
    return users.value?.map((user) => ({
        ...user,
        label: `${user.first_name} ${user.last_name}`,
    }));
});

// User roles

const userRoleRefresher = ref(0);

const userRoles = computedAsync(async () => {
    if (userRoleRefresher.value !== undefined) {
        if (!userFromId.value) return [];
        return await $fetch(`/api/user/${userFromId.value.id}/roles`);
    }
}, null);

const giveUserRole = async (role: string) => {
    try {
        if (!userFromId.value) return;
        await $fetch(`/api/user/${userActionState.uid}/roles`, {
            method: "POST",
            body: { role },
        });
        toast.add({
            title: "Успешно",
            description: "Роль успешно добавлена",
            color: "green",
        });
        userRoleRefresher.value++;
    } catch (error) {
        toast.add({
            title: "Ошибка",
            description: (error as Error).message,
            color: "red",
        });
    }
};

const revokeUserRole = async (role: string) => {
    try {
        if (!userFromId.value) return;
        await $fetch(`/api/user/${userActionState.uid}/roles`, {
            method: "DELETE",
            body: { role },
        });
        toast.add({
            title: "Успешно",
            description: "Роль успешно удалена",
            color: "green",
        });
        userRoleRefresher.value++;
    } catch (error) {
        toast.add({
            title: "Ошибка",
            description: (error as Error).message,
            color: "red",
        });
    }
};

const userRolePicked = ref();

watch(userRolePicked, (picked) => {
    if (!picked) return;
    giveUserRole(picked);
    userRolePicked.value = undefined;
});
</script>

<template>
	<div class="flex flex-col gap-4">
		<UAlert
			title="Корневой пользователь"
			:color="useKeyToColor('root')"
			variant="soft"
			icon="ph:identification-badge-duotone"
            :class="sectionActive ? 'cursor-zoom-out' : 'cursor-zoom-in'"
            @click="sectionActive = !sectionActive"
		/>
        <template v-if="sectionActive">
		<div class="flex gap-2">
			<UPopover v-if="roles">
				<UButton color="gray" label="Роли" />
				<template #panel>
					<UCard>
						<div class="flex flex-col gap-2 divide-y divide-gray-800">
							<div
								class="role flex gap-2 w-80 items-center pt-2"
								v-for="role in roles"
								:key="role.key"
							>
								<UBadge
									variant="soft"
									:color="useKeyToColor(role.key)"
									>{{ role.key }}</UBadge
								>
								<p
									class="overflow-hidden text-xs text-wrap text-right opacity-80"
									:title="role.description"
								>
									{{ role.description }}
								</p>
							</div>
							<div class="border-none">
								<UButtonGroup>
									<UInput
										v-model="newRoleState.key"
										placeholder="Роль"
										size="xs"
									/>
									<UInput
										v-model="newRoleState.description"
										placeholder="Описание"
										size="xs"
									/>
									<UButton
										icon="mdi:plus"
										size="xs"
										@click="
											createRole(
												newRoleState.key,
												newRoleState.description
											)
										"
										color="gray"
									/>
								</UButtonGroup>
							</div>
						</div>
					</UCard>
				</template>
			</UPopover>
			<UPopover v-if="users" v-model:open="popoverActive">
				<UButton color="gray" label="Пользователи" />
				<template #panel>
					<UCard>
						<div class="flex flex-col gap-2" v-if="users">
							<UButtonGroup>
								<UInputMenu
									v-model="userActionState.uid"
									:options="userOptions"
									:search-attributes="['username', 'id']"
									value-attribute="id"
								/>
								<UButton
									icon="line-md:edit-twotone-full"
									@click="
										userActionState.edit = true;
										popoverActive = false;
									"
									:disabled="!userFromId"
									color="gray"
								/>
							</UButtonGroup>
							<UButton
								color="gray"
								icon="line-md:person-add-filled"
								@click="
									userActionState.add = true;
									popoverActive = false;
									userActionState.uid = '';
								"
								>Добавить пользователя</UButton
							>
						</div>
					</UCard>
				</template>
			</UPopover>
			<!-- Add user modal -->
			<UModal v-model="userActionState.add">
				<UCard>
					<template #header>
						<h3 class="text-lg font-bold">Добавить пользователя</h3>
					</template>
					<UAlert class="mb-4" variant="subtle" color="yellow" title="Пользователь появиться только если он ранее входил" icon="mdi:alert" />
					<div class="flex gap-2 items-center mb-4" v-if="userFromId">
						<UAvatar :src="userFromId.photo_url" size="lg" />
						<div class="flex flex-col">
							<h3 class="text-lg font-bold">
								{{ userFromId.first_name }}
								{{ userFromId.last_name }}
							</h3>
							<p class="text-sm text-gray-500">
								Создан
								{{
									useFormattedInterval(
										now / 1000 - userFromId.auth_date
									)
								}}
								назад
							</p>
						</div>
					</div>
					<UButtonGroup class="w-full">
						<UInput
							class="w-full"
							v-model="userActionState.uid"
							placeholder="ID пользователя"
						/>
						<UButton
							color="gray"
							label="Добавить"
							:disabled="!userFromId"
							@click="createUser"
						/>
					</UButtonGroup>
				</UCard>
			</UModal>
			<!-- Edit user modal -->
			<UModal v-model="userActionState.edit">
				<UCard>
					<template #header>
						<div class="flex gap-2">
							<UAvatar :src="userFromId.photo_url" size="lg" />
							<div class="info">
								<h3 class="text-lg font-bold">
									{{ userFromId.first_name }}
									{{ userFromId.last_name }}
								</h3>
								<p class="text-sm text-gray-500">
									@{{ userFromId.username }} | Создан
									{{
										useFormattedInterval(
											now / 1000 - userFromId.auth_date
										)
									}}
									назад
								</p>
							</div>
						</div>
					</template>
					<h3 class="text-lg font-semibold mb-2">Роли</h3>
					<div class="flex gap-2 items-center flex-wrap">
						<UBadge
							v-for="role in userRoles"
							:key="role"
							variant="soft"
							:color="useKeyToColor(role)"
							>{{ role }} <UButton v-if="role !== 'root'" class="ml-2" color="white" size="xs" variant="link" :padded="false" icon="mdi:close" @click="revokeUserRole(role)" /></UBadge
						/>
						<UButtonGroup size="xs">
							<UInputMenu
								:options="
									roles.map((role: Role) => ({
										label: role.key,
									}))
								"
								value-attribute="label"
								v-model="userRolePicked"
								placeholder="Добавить роль"
							/>
						</UButtonGroup>
					</div>
				</UCard>
			</UModal>
		</div></template>
	</div>
</template>

<style lang="scss" scoped></style>
