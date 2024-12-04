<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	console.log(data);
	const categories = data.categories;
</script>

<main class="flex w-full max-w-screen-lg flex-col gap-xl">
	<h1>{data.event.name}</h1>
	<p>{data.event.description}</p>

	<section class="flex flex-col gap-xl">
		<h2>Categories</h2>
		{#each categories as category}
			<div class="flex flex-col gap-sm">
				<a href="/submissions?event={data.event.id}&category={category.id}">
					<h3>{category.name}</h3>
				</a>
				<div class="flex gap-xl">
					<div class="flex flex-1 flex-col gap-sm">
						<h4>About {category.name}</h4>
						<p class="text-muted-foreground-alt">{category.description}</p>
					</div>
					<div class="flex flex-1 flex-col gap-sm">
						<h4>Rules</h4>
						<ol class="flex flex-col gap-sm">
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
