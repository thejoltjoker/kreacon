<script lang="ts">
	import { browser } from '$app/environment';
	import '$lib/i18n';
	import { userStore } from '$lib/stores/userStore';
	import { locale, waitLocale } from 'svelte-i18n';
	import '../app.css';
	import type { LayoutData, LayoutLoad } from './$types';

	export const load: LayoutLoad = async () => {
		if (browser) {
			locale.set(window.navigator.language);
		}
		await waitLocale();
	};

	export let data: LayoutData;
	if (data.user) {
		userStore.set(data.user);
	}
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<slot />
