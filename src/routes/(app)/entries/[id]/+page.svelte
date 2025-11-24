<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { type PageData } from './$types';
	import HeaderSection from './_components/HeaderSection.svelte';
	import InfoSection from './_components/InfoSection.svelte';
	import MediaSection from './_components/MediaSection.svelte';
	import ReactionsSection from './_components/ReactionsSection.svelte';

	const user = $derived($page.data.user);

	let { data }: { data: PageData } = $props();
	let isVoted = $state(data.isVoted ?? false);
	let entry = $derived(data.entry);
	let isOpenForVoting = $derived(data.isOpenForVoting ?? false);
</script>

{#if entry != null}
	<main
		class="gap-sm px-sm pt-sm md:gap-xl md:px-xl md:pt-xl flex w-full max-w-(--breakpoint-lg) flex-col"
	>
		<HeaderSection {entry} {user} bind:isVoted {isOpenForVoting} />
		<MediaSection {entry} />
		<InfoSection {entry} {user} bind:isVoted {isOpenForVoting} />
		<ReactionsSection reactions={entry.reactions} />
		<!-- TODO More work/related grid -->
	</main>
{:else}
	<main class="flex h-full w-full items-center justify-center">
		<h2>{$t('Entry not found')}</h2>
	</main>
{/if}
