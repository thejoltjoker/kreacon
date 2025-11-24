<script lang="ts">
	import { Accordion } from 'bits-ui';
	import { ChevronDownIcon } from 'lucide-svelte';
	import type { PageData } from '../$types';

	let { categories }: { categories: PageData['categories'] } = $props();
</script>

<Accordion.Root class="w-full" type="multiple">
	{#each categories as category, index (category.id)}
		<Accordion.Item value={index.toString()} class="group border-shade-700 border-b">
			<Accordion.Header>
				<Accordion.Trigger
					class="py-sm flex w-full flex-1 items-center justify-between font-bold transition-all select-none [&[data-state=open]>span>svg]:rotate-180"
				>
					<span class="text-h3 w-full text-left font-bold">
						{category.name}
					</span>
					<span
						class="hover:bg-shade-700 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all"
					>
						<ChevronDownIcon class="size-lg transition-all duration-200" />
					</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content
				class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden tracking-[-0.01em]"
			>
				<div class="pb-lg">
					<p class="pb-lg text-white">{category.description}</p>
					<ul class="text-shade-300 marker:text-primary list-inside list-disc">
						{#each category.rules as rule (rule.id)}
							<li>{rule.text}</li>
						{/each}
					</ul>
					<p class="pt-sm text-shade-300 text-sm">
						Submission type: <span class="font-bold text-white">{category.mediaType}</span>
					</p>
				</div>
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
