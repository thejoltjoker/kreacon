<script lang="ts">
	import { page } from '$app/stores';
	import Avatar from '$lib/components/Avatar.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import FileField from '$lib/components/Form/FileField.svelte';
	import FormMessage from '$lib/components/Form/FormMessage.svelte';
	import Form from '$lib/components/Form/GenericForm.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import { updateUserSchema } from '$lib/schemas/user';
	import { createPublicUrl } from '$lib/utils';
	import { Label } from 'bits-ui';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import EditProfileButton from './EditProfileButton.svelte';

	let isEditing: boolean = $state(false);
</script>

<!-- TODO Unify wording sign up/sign in or register/log in -->

<section class="gap-sm flex w-full flex-col">
	<Form
		invalidateAll={true}
		action="/profile?/updateUser"
		data={$page.data.userForm}
		options={{
			resetForm: false,
			validators: zod4Client(updateUserSchema),
			onResult: ({ result }) => {
				if (result.type === 'success') {
					isEditing = false;
				}
			}
		}}
	>
		<div class="flex items-center justify-between">
			<h2>General</h2>
			<EditProfileButton bind:isEditing />
		</div>
		<div class="gap-sm flex flex-col">
			{#if isEditing}
				<FileField
					behavior="managed"
					field="avatarId"
					label="Avatar"
					mediaType="image"
					customUploadUrl={createPublicUrl('/api/uploads/avatar')}
				/>
			{:else}
				<p class="font-bold">Avatar</p>
				<div class="gap-sm flex items-center">
					<Avatar size="md" src={$page.data.user.avatar?.url} alt={$page.data.user.username} />
				</div>
			{/if}
		</div>
		<TextField
			type="text"
			field="username"
			label="Username"
			variant={isEditing ? 'default' : 'ghost'}
			disabled={!isEditing}
		/>
		<div class="gap-xs flex flex-col">
			<Label.Root for="email" class="gap-xs flex items-center font-bold">
				Email
				{#if $page.data.user?.emailVerifiedAt}
					<Badge variant="success" size="sm">Verified</Badge>
				{:else}
					<Badge variant="neutral" size="sm">Unverified</Badge>
				{/if}
			</Label.Root>
			<TextField
				type="text"
				field="email"
				label=""
				readonly
				variant="ghost"
				labelProps={{ class: 'hidden' }}
			/>
		</div>
		{#if isEditing}
			<div>
				<Button type="submit">Update</Button>
			</div>
		{/if}
		<FormMessage />
	</Form>
</section>
