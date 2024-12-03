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
			<div>
				<a href="/submissions?event={data.event.id}&category={category.id}">
					<h3>{category.name}</h3>
				</a>
				<div class="flex gap-xl">
					<div class="flex-1">
						<h4>About {category.name}</h4>
						<p class="text-sm text-muted-foreground-alt">{category.description}</p>
					</div>
					<div class="flex-1">
						<h4>Rules</h4>
						<ul>
							{#each category.rules as rule}
								<li>{rule.text}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		{/each}
	</section>
</main>
