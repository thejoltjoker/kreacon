<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import { _ } from 'svelte-i18n';
	import type { PageData } from './$types';
	import FilterBar from './_components/FilterBar.svelte';

	export let data: PageData;
	const { submissions, categories } = data;
	console.log(submissions);
</script>

<h1 class="text-2xl font-bold">{$_('submissions', { default: 'Submissions' })}</h1>

<div class="py-sm">
	<FilterBar {categories} />
</div>
<div class="grid grid-cols-submissions gap-sm">
	{#each submissions as submission}
		<div class="wrapper group grid overflow-hidden rounded-md">
			<div class="h-full w-full overflow-hidden rounded-md">
				<a href={`/submissions/${submission.id}`}>
					{#if submission?.media?.type === 'image'}
						<img
							src={`${submission?.media?.url}`}
							alt={submission?.media?.alt}
							class="w-full object-cover object-center"
						/>
					{:else if submission?.media?.type === 'audio'}
						<img
							src={`/images/music-thumbnail.webp`}
							alt="Audio"
							class="w-full object-cover object-center"
						/>
					{/if}
				</a>
			</div>
			<div class="items-left pointer-events-none flex h-full w-full flex-col justify-between p-sm">
				<a
					href={`/users/${submission.user?.username}`}
					class="pointer-events-auto inline-flex w-fit -translate-y-sm items-center gap-sm rounded-full p-xs pr-md opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:bg-black/75 group-hover:opacity-100 group-hover:backdrop-blur"
				>
					<Avatar
						src={submission.user?.picture ?? ''}
						alt={submission.user?.username ?? 'User picture'}
					/>
					<p>{submission.user?.username}</p>
				</a>
				<div
					class="translate-y-sm rounded-md p-sm opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:bg-black/75 group-hover:opacity-100 group-hover:backdrop-blur"
				>
					<h2 class="text-lg font-bold">{submission.title}</h2>
					<p class="text-zinc-400">{submission.category?.name}</p>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.wrapper {
		display: grid;
		& > * {
			grid-column: 1;
			grid-row: 1;
		}
	}
</style>
