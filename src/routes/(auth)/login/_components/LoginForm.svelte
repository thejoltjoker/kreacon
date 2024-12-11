<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import Link from '$lib/components/Link.svelte';
	import { t } from '$lib/i18n';
	import { loginSchema, type ZLoginSchema } from '$lib/schemas/loginSchema';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	let { data }: { data: SuperValidated<Infer<ZLoginSchema>> } = $props();
	const superform = superForm(data, { validators: zod(loginSchema) });
	const { form, message, enhance } = superform;
</script>

<SuperDebug data={$form} />
<form method="POST" action="/login?/login" use:enhance class="flex w-full flex-col gap-xl">
	<TextField {superform} type="email" field="email" label="Email" />
	<TextField {superform} type="password" field="password" label="Password" />
	<Button type="submit">Log in</Button>
	{#if $message}
		<p class="message text-center text-red-500">{$message.text}</p>
	{/if}

	<p class="text-center">
		{$t('Not a member?')}
		<Link href="/register">{$t('Register')}</Link>
	</p>
</form>
