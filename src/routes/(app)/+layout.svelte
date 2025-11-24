<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
	let title = $derived($page.data.title.text ?? 'Kreacon');
</script>

<svelte:head>
	<title>{$t(title)}</title>
</svelte:head>

<div class="gap-xl flex h-full grow flex-col items-center">
	{@render children()}
</div>
