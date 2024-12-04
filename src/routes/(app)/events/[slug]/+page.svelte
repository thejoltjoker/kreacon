<script lang="ts">
	import { Separator } from 'bits-ui';
	import type { PageData } from './$types';
	import { locale } from 'svelte-i18n';

	let { data }: { data: PageData } = $props();
	console.log(data);
	const categories = data.categories;
</script>

<main class="flex w-full max-w-screen-lg flex-col gap-xl pt-xl">
	<h1>{data.event.name}</h1>
	<p class="text-lg">{data.event.description}</p>
	<div class="flex gap-xl">
		<div class="flex flex-1 flex-col gap-sm">
			<h2>Submissions</h2>
			<div>
				<!-- TODO Design -->
				<p class="text-muted-foreground-alt">Opens at</p>
				<p class="text-2xl font-bold">
					{new Intl.DateTimeFormat($locale ?? 'en', {
						dateStyle: 'long',
						timeStyle: 'short'
					}).format(data.event.submissionsOpenAt)}
				</p>
			</div>
			<div>
				<p class="text-muted-foreground-alt">Closes at</p>
				<p class="text-2xl font-bold">
					{new Intl.DateTimeFormat($locale ?? 'en', {
						dateStyle: 'long',
						timeStyle: 'short'
					}).format(data.event.submissionsCloseAt)}
				</p>
			</div>
		</div>
		<div class="flex flex-1 flex-col gap-sm">
			<h2>Voting</h2>
			<div>
				<p class="text-muted-foreground-alt">Opens at</p>
				<p class="text-2xl font-bold">
					{new Intl.DateTimeFormat($locale ?? 'en', {
						dateStyle: 'long',
						timeStyle: 'short'
					}).format(data.event.votingOpenAt)}
				</p>
			</div>
			<div>
				<p class="text-muted-foreground-alt">Closes at</p>
				<p class="text-2xl font-bold">
					{new Intl.DateTimeFormat($locale ?? 'en', {
						dateStyle: 'long',
						timeStyle: 'short'
					}).format(data.event.votingCloseAt)}
				</p>
			</div>
		</div>
	</div>

	<section class="flex flex-col gap-xl">
		<h2>Categories</h2>
		{#each categories as category}
			<div class="card flex flex-col gap-sm">
				<a href="/submissions?event={data.event.id}&category={category.id}">
					<h3>{category.name}</h3>
				</a>
				<div class="flex flex-col gap-xl">
					<div class="flex flex-1 flex-col gap-sm">
						<h4>About {category.name}</h4>
						<p>{category.description}</p>
					</div>
					<div class="flex flex-1 flex-col gap-sm">
						<h4>Rules</h4>
						<ol class="flex flex-col gap-sm text-lg font-bold">
							{#each category.rules as rule, index}
								<li class="flex gap-sm">
									<p class="text-muted-foreground-alt">{index + 1}.</p>
									<p>{rule.text}</p>
								</li>
							{/each}
						</ol>
					</div>
				</div>
			</div>
		{/each}
	</section>
</main>
