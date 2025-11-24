<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form/GenericForm.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import { registerUserSchema } from '$lib/schemas/user';
	import { zod4Client } from 'sveltekit-superforms/adapters';
</script>

<!-- TODO Unify wording sign up/sign in or register/log in -->
<Form action="?/register" data={$page.data.form} options={{ validators: zod4Client(registerUserSchema) }}>
	<TextField type="text" field="username" label="Username" />
	<TextField type="text" field="email" label="Email" />
	<TextField type="password" field="password" label="Password" />
	<Button type="submit">Register</Button>
</Form>
