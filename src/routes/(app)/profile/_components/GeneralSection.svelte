<script lang="ts">
	import Form from '$lib/components/Form/GenericForm.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import { updateUserSchema } from '$lib/schemas/user';
	import { zod } from 'sveltekit-superforms/adapters';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import FormMessage from '$lib/components/Form/FormMessage.svelte';
	import EditProfileButton from './EditProfileButton.svelte';

	let isEditing: boolean = $state(false);
</script>

<!-- TODO Unify wording sign up/sign in or register/log in -->

<section class="flex w-full flex-col gap-sm">
	<Form
		invalidateAll={false}
		action="/profile?/updateUser"
		data={$page.data.userForm}
		options={{
			resetForm: false,
			validators: zod(updateUserSchema),
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

		<TextField
			type="text"
			field="username"
			label="Username"
			variant={isEditing ? 'default' : 'ghost'}
			disabled={!isEditing}
		/>
		<TextField type="text" field="email" label="Email" readonly variant="ghost" />
		{#if isEditing}
			<div>
				<Button type="submit">Update</Button>
			</div>
		{/if}
		<FormMessage />
	</Form>
</section>
