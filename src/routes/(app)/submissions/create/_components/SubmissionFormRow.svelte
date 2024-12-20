<script lang="ts">
	import { Accordion } from 'bits-ui';
	import { ChevronDownIcon } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	interface Props extends Accordion.ItemProps {
		title: string;
		value: string;
		children: Snippet;
	}
	let { title, children, value }: Props = $props();
</script>

<Accordion.Item {value}>
	<Accordion.Header>
		<Accordion.Trigger
			class="flex h-form w-full items-center justify-between transition-all duration-500 hover:text-shade-200 [&[data-state=open]>span>svg]:rotate-180"
		>
			<span class="text-2xl font-bold">
				{title}
			</span>
			<span>
				<ChevronDownIcon />
			</span>
		</Accordion.Trigger>
	</Accordion.Header>
	<Accordion.Content
		class="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
	>
		{@render children()}
	</Accordion.Content>
</Accordion.Item>
