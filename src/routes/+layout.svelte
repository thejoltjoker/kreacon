<script lang="ts">
	import { browser } from '$app/environment';
	import '$lib/i18n';

	import { locale, waitLocale } from 'svelte-i18n';
	import '../app.css';
	import type { LayoutData, LayoutLoad } from './$types';
	import { userProvider } from '$lib/providers/userProvider.svelte';

	export let data: LayoutData;
	export const load: LayoutLoad = async () => {
		if (browser) {
			locale.set(window.navigator.language);
		}
		await waitLocale();
	};

	userProvider.user = data.user;
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<slot />
