<script lang="ts">
	import { Accordion } from 'bits-ui';
	import { ChevronDownIcon } from 'lucide-svelte';
	import type { PageData } from '../$types';

	let { categories }: { categories: PageData['categories'] } = $props();
</script>

<Accordion.Root class="w-full" type="multiple">
	{#each categories as category, index}
		<Accordion.Item value={index.toString()} class="group border-b border-shade-700">
			<Accordion.Header>
				<Accordion.Trigger
					class="flex w-full flex-1 select-none items-center justify-between py-sm font-bold transition-all [&[data-state=open]>span>svg]:rotate-180"
				>
					<span class="w-full text-left text-h3 font-bold">
						{category.name}
					</span>
					<span
						class="inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all hover:bg-shade-700"
					>
						<ChevronDownIcon class="size-lg transition-all duration-200" />
					</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content
				class="overflow-hidden tracking-[-0.01em] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
			>
				<div class="pb-lg">
					<p class="pb-lg text-white">{category.description}</p>
					<ul class="list-inside list-disc text-shade-300 marker:text-primary">
						{#each category.rules as rule}
							<li>{rule.text}</li>
						{/each}
					</ul>
					<p class="pt-sm text-sm text-shade-300">
						Submission type: <span class="font-bold text-white">{category.mediaType}</span>
					</p>
				</div>
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
