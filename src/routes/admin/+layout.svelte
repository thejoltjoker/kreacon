<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t } from '$lib/i18n';
	import { page } from '$app/stores';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
	let title = $derived($page.data.title.text ?? 'Kreacon Admin');
</script>

<svelte:head>
	<title>{$t(title)}</title>
</svelte:head>

<div class="flex min-h-full grow flex-col items-center">
	{@render children()}
</div>
