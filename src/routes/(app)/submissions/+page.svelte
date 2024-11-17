<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { PageData } from './$types';
	import FilterBar from './_components/FilterBar.svelte';
	import { fly } from 'svelte/transition';
	import Avatar from '$lib/components/Avatar.svelte';

	export let data: PageData;
	const { submissions, user, categories } = data;
	console.log(submissions);
</script>

<h1 class="text-2xl font-bold">{$_('entity.submission.plural', { default: 'Submissions' })}</h1>

<div class="py-sm">
	<FilterBar {categories} />
</div>
<div class="grid grid-cols-submissions gap-sm">
	{#each submissions as submission}
		<div class="wrapper group grid overflow-hidden rounded-md">
			<div class="h-full w-full overflow-hidden rounded-md">
				<a href={`/submissions/${submission.id}`}>
					<img
						src={`${submission?.media?.url}`}
						alt={submission?.media?.alt}
						class="w-full object-cover object-center"
					/>
				</a>
			</div>
			<div class="items-left pointer-events-none flex h-full w-full flex-col justify-between p-sm">
				<a
					href={`/users/${submission.user?.username}`}
					class="pointer-events-auto inline-flex w-fit -translate-y-sm items-center gap-sm rounded-full p-xs pr-md opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:bg-black/75 group-hover:opacity-100 group-hover:backdrop-blur"
				>
					<Avatar src={`/${submission.user?.picture}`} />
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
