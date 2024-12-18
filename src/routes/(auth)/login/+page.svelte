<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import OAuthButtons from '../_components/OAuthButtons.svelte';
	import type { PageData } from './$types';
	import LoginForm from './_components/LoginForm.svelte';
	import { t } from '$lib/i18n';

	const { data }: { data: PageData } = $props();
</script>

<div class="flex w-full flex-col gap-lg">
	<h1 class="text-center">Log in</h1>
	{#if data.providers.length > 0}
		<OAuthButtons providers={[...data.providers]} />
		<Divider>{$t('or sign in with email')}</Divider>
	{/if}
	<LoginForm data={data.form} />
</div>
