<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { t } from '$lib/i18n';
	import Form from '$lib/components/Form/GenericForm.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import FormMessage from '$lib/components/Form/FormMessage.svelte';
	import Link from '$lib/components/Link.svelte';
	import type { PageData } from './$types';
	import { resendEmailSchema } from '$lib/schemas/verifyEmail';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data }: { data: PageData } = $props();
</script>

<div class="gap-lg flex w-full flex-col">
	<h1 class="text-center">{$t('Verify Email')}</h1>

	<div class="gap-sm flex flex-col">
		<p>
			{$t(
				"We've sent a verification email to your inbox. Please check your email and click the verification link."
			)}
		</p>
		<p class="text-muted-foreground-alt text-sm">
			{$t(
				"Didn't receive the email? Enter your email address below and we'll send you a new verification link."
			)}
		</p>
	</div>

	<Form
		action="?/resend"
		data={data.form}
		options={{
			validators: zod4Client(resendEmailSchema),
			resetForm: false
		}}
	>
		<TextField type="email" field="email" label="Email" />
		<Button type="submit">{$t('Resend Verification Email')}</Button>
		<FormMessage />
	</Form>

	<p class="text-center">
		{$t('Already verified?')}
		<Link href="/login">{$t('Log in')}</Link>
	</p>
</div>
