<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import type { Category } from '$lib/server/db/schema/category';
	import type { SelectFile } from '$lib/server/db/schema/file';
	import type { Submission } from '$lib/server/db/schema/submission';
	import type { PublicUser } from '$lib/server/db/schema/user';
	import StatusIcon from '../submissions/_components/StatusIcon.svelte';

	interface Props {
		submission: Submission & { category: Category; thumbnail: SelectFile; user: PublicUser };
	}

	let { submission }: Props = $props();
</script>

<div class="wrapper group grid overflow-hidden rounded-md">
	<div class="aspect-square h-full w-full overflow-hidden rounded-md">
		<a href={`/submissions/${submission.id}`}>
			<img
				src={`${submission.thumbnail.url}`}
				alt={submission.title}
				class="h-full w-full object-cover object-center"
			/>
		</a>
	</div>
	<div
		class="items-left pointer-events-none relative flex h-full w-full flex-col justify-between p-sm"
	>
		{#if ['draft', 'pending'].includes(submission.status)}
			<div class="absolute right-sm top-sm">
				<StatusIcon status={submission.status} />
			</div>
		{/if}
		<a
			href={`/users/${submission.user.username}`}
			class="pointer-events-auto inline-flex h-form w-fit translate-y-0 items-center gap-sm rounded-full p-xs pr-md transition-all duration-300 group-hover:bg-black/75 group-hover:backdrop-blur md:-translate-y-sm md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
		>
			<Avatar src={submission.user.picture ?? ''} size="auto" username={submission.user.username} />
			<p>{submission.user.username}</p>
		</a>
		<div
			class="rounded-md bg-black/75 p-sm backdrop-blur transition-all duration-300 group-hover:backdrop-blur md:translate-y-sm md:bg-none md:opacity-0 md:backdrop-blur-none md:group-hover:translate-y-0 md:group-hover:bg-black/75 md:group-hover:opacity-100"
		>
			<h2 class="text-lg font-bold">{submission.title}</h2>
			<p class="text-muted-foreground">{submission.category.name}</p>
		</div>
	</div>
</div>

<style lang="postcss">
	.wrapper {
		@apply grid;
		& > * {
			grid-column: 1;
			grid-row: 1;
		}
	}
</style>
