<script lang="ts">
	import { browser } from '$app/environment';
	import '$lib/i18n';
	import { user } from '$lib/stores/userStore';
	import { locale, waitLocale } from 'svelte-i18n';
	import '../app.css';
	import type { LayoutData, LayoutLoad } from './$types';

	export let data: LayoutData;
	export const load: LayoutLoad = async () => {
		if (browser) {
			locale.set(window.navigator.language);
		}
		await waitLocale();
	};

	user.set(data.user);
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<slot />
