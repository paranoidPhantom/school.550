<script lang="ts" setup>
import { useClipboard } from "@vueuse/core";
import type { User } from "@supabase/supabase-js";

definePageMeta({
	layout: "manage",
});

const { auth } = useSupabaseClient();

const user = useSupabaseUser();

const { data: perms } = await useFetch<string[] | null>(
	`/api/user/${(user.value as User).id}/perms`,
	{
		headers: useRequestHeaders(["cookie"]),
	},
);

const loggingOut = ref(false);

const logout = async () => {
	loggingOut.value = true;
	await auth.signOut();
	window.location.reload();
};

const uid = ref(user.value ? user.value.id : "");
const { copy, copied, isSupported } = useClipboard({ source: uid.value });
</script>

<template>
	<div v-if="user" class="__manage p-8">
		<UCard>
			<template #header>
				<div class="flex items-center gap-4">
					<UAvatar
						v-if="user.user_metadata.avatar_url"
						:src="user.user_metadata.avatar_url"
						icon="line-md:account"
						size="xl"
					/>
					<div class="flex justify-between gap-4">
						<h2
							v-if="
								user.user_metadata.first_name &&
								user.user_metadata.last_name
							"
							class="text-xl"
						>
							{{ user.user_metadata.first_name }}
							{{ user.user_metadata.last_name }}
						</h2>
						<p v-else>
							{{ user.email }}
						</p>
					</div>
					<UButton
						class="ml-auto"
						:icon="
							loggingOut
								? 'svg-spinners:3-dots-scale'
								: 'line-md:logout'
						"
						variant="ghost"
						color="white"
						size="xl"
						@click="logout"
					/>
				</div>
			</template>
			<div v-if="perms" class="flex flex-col gap-4">
				<ManageOptionRoot v-if="perms.includes('root')" />
				<ManageOptionContent v-if="perms.includes('edit_content')" />
				<ManageOptionFS v-if="perms.includes('fs')" />
				<UAlert
					v-if="perms.length === 0"
					color="yellow"
					variant="subtle"
					title="Вам еще не выдали права для работы с системой"
					icon="mdi:alert-circle-outline"
				>
					<template #description>
						Ваш ID -
						<UBadge color="yellow" variant="solid"
							>{{ user.id }}
							<UButton
								v-if="isSupported"
								class="ml-2"
								:padded="false"
								variant="link"
								:icon="
									copied
										? 'mdi:check'
										: 'ic:twotone-content-copy'
								"
								color="white"
								size="xs"
								@click="copy(user.id)"
							/>
						</UBadge>
					</template>
				</UAlert>
			</div>
		</UCard>
	</div>
</template>

<style lang="scss" scoped></style>
