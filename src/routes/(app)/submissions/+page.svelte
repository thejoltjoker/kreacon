<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { PageData } from './$types';
	import FilterBar from './_components/FilterBar.svelte';

	export let data: PageData;
	const { submissions, user } = data;
	console.log(submissions);
</script>

<h1>{$_('entity.submission.plural', { default: 'Submissions' })}</h1>

<FilterBar />
<div class="grid-cols-submissions grid gap-sm">
	{#each submissions as submission}
		<a href={`/submissions/${submission.id}`}>
			<div class="flex grow basis-[300px] flex-col gap-sm">
				<div class="w-full overflow-hidden rounded-md">
					<img
						src={`${submission?.media?.url}`}
						alt={submission?.media?.alt}
						class="w-full object-cover object-center"
					/>
				</div>
				<div>
					<h2 class="text-lg font-bold">{submission.title}</h2>
					<p class="text-zinc-400">{submission.user?.username}</p>
				</div>
			</div>
		</a>
	{/each}
</div>
