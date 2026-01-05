<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import type { Category } from '$lib/server/db/schema/category';
	import type { SelectFile } from '$lib/server/db/schema/file';
	import type { Entry } from '$lib/server/db/schema/entry';
	import type { PublicUser } from '$lib/server/db/schema/user';
	import StatusIcon from '../entries/_components/StatusIcon.svelte';
	import { cn } from '$lib/utils';

	interface Props {
		entry: Entry & { category: Category; preview: SelectFile; user: PublicUser };
	}

	let { entry }: Props = $props();
</script>

<div class="wrapper group grid max-w-full overflow-hidden rounded-md">
	<div class="aspect-square h-full w-full overflow-hidden rounded-md">
		<a href={`/entries/${entry.id}`}>
			<img
				src={`${entry.preview.url}`}
				alt={entry.title}
				class={cn(
					'h-full w-full object-cover object-center',
					entry.category?.name?.toLowerCase().includes('oldschool graphics') && 'render-pixelated'
				)}
			/>
		</a>
	</div>
	<div
		class="items-left p-sm pointer-events-none relative flex h-full w-full flex-col justify-between"
	>
		{#if ['draft', 'pending'].includes(entry.status)}
			<div class="right-sm top-sm absolute">
				<StatusIcon status={entry.status} />
			</div>
		{/if}
		<a
			href={`/users/${entry.user.username}`}
			class="h-form gap-sm p-xs pr-md md:-translate-y-sm pointer-events-auto inline-flex w-fit translate-y-0 items-center rounded-full transition-all duration-300 group-hover:bg-black/75 group-hover:backdrop-blur md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
		>
			<Avatar src={entry.user.avatar?.url ?? ''} size="auto" username={entry.user.username} />
			<p>{entry.user.username}</p>
		</a>
		<div
			class="p-sm md:translate-y-sm rounded-md bg-black/75 backdrop-blur transition-all duration-300 group-hover:backdrop-blur md:bg-none md:opacity-0 md:backdrop-blur-none md:group-hover:translate-y-0 md:group-hover:bg-black/75 md:group-hover:opacity-100"
		>
			<h2 class="text-lg font-bold">{entry.title}</h2>
			<p class="text-shade-300">{entry.category.name}</p>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "../../../app.css";

	.wrapper {
		@apply grid;
		& > * {
			grid-column: 1;
			grid-row: 1;
		}
	}
</style>
