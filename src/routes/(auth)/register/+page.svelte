<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import { t } from '$lib/i18n';
	import OAuthButtons from '../_components/OAuthButtons.svelte';
	import RegisterForm from './_components/RegisterForm.svelte';
	import type { PageData } from './$types';
	import Link from '$lib/components/Link.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex w-full flex-col gap-lg">
	<h1 class="text-center">Sign up</h1>
	{#if data.providers.length > 0}
		<OAuthButtons providers={data.providers} />
		<Divider>or use your email</Divider>
	{/if}

	<RegisterForm />

	<p class="text-center">
		{$t('Already a member?')}
		<Link href="/login">{$t('Log in')}</Link>
	</p>
</div>
