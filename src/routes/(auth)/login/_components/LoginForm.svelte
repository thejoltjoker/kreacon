<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import Link from '$lib/components/Link.svelte';
	import { t } from '$lib/i18n';
	import { loginSchema, type ZLoginSchema } from '$lib/schemas/loginSchema';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	let { data }: { data: SuperValidated<Infer<ZLoginSchema>> } = $props();
	const superform = superForm(data, { validators: zod(loginSchema) });
	const { message, enhance } = superform;
	const redirect = $page.url.searchParams.get('redirect');
</script>

<form method="POST" action="/login?/login" use:enhance class="gap-xl flex w-full flex-col">
	<TextField {superform} type="email" field="email" label="Email" />
	<TextField {superform} type="password" field="password" label="Password" />
	<input type="text" name="redirect" value={redirect} hidden />
	<Button type="submit" class="login-button">Log in</Button>
	{#if $message}
		<p class="message text-center text-red-500">{$message.text}</p>
	{/if}

	<p class="text-center">
		{$t('Not a member?')}
		<Link href="/register">{$t('Register')}</Link>
	</p>
</form>
