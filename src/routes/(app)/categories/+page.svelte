<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let categories = data.categories;
</script>

<main>
	{#each categories as category}
		<section>
			<h2>{category.name}</h2>
			<div class="flex gap-xl">
				<div class="flex-1">
					<h3>About {category.name}</h3>
					<p class="text-sm text-muted-foreground-alt">{category.description}</p>
				</div>
				<div class="flex-1">
					<h3>Rules</h3>
					<ul>
						{#each category.categoriesToRules as rule}
							<li>{rule.rule.text}</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>
	{/each}
</main>
