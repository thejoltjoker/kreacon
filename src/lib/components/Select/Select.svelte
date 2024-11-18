<script lang="ts">
	import { createSelect, melt, type SelectOption } from '@melt-ui/svelte';
	import { CheckIcon, ChevronDownIcon } from 'lucide-svelte';
	import { fly, fade, slide } from 'svelte/transition';
	import type { SelectOptions } from './Select.types';

	export let options: SelectOptions;
	let selectLabel: string;
	export { selectLabel as label };
	export let selectedLabelPrefix: string;
	export let defaultSelected: SelectOption<string> | undefined = undefined;

	const {
		elements: { trigger, menu, option, group, groupLabel, label },
		states: { selectedLabel, open },
		helpers: { isSelected }
	} = createSelect<string>({
		defaultSelected: defaultSelected,
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true
		}
	});
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label class="label hidden" use:melt={$label}>{selectLabel}</label>
	<button class="trigger" use:melt={$trigger} aria-label="Food">
		{`${selectedLabelPrefix ?? ''} ${$selectedLabel}` || 'Select one'}
		<ChevronDownIcon class="-mr-1 ms-2 size-5" />
	</button>
	{#if $open}
		<div class="container" use:melt={$menu} transition:fly={{ y: -20, duration: 150 }}>
			{#each options as opt}
				{#if typeof opt.value !== 'string' && opt.label}
					<div use:melt={$group(opt.label)}>
						<div class="group" use:melt={$groupLabel(opt.label)}>
							{opt.label}
						</div>
						{#each opt.value as item}
							<div
								class="item"
								use:melt={$option({ value: item.label, label: item.label })}
								class:underline={$isSelected(item.label)}
							>
								<div class="check {$isSelected(item.label) ? 'block' : 'hidden'}">
									<CheckIcon class="size-4" />
								</div>
								{item.label}
							</div>
						{/each}
					</div>
				{:else}
					<div
						class="item"
						use:melt={$option({ value: opt.label, label: opt.label })}
						class:underline={$isSelected(opt.label)}
					>
						<!-- <div class="check {$isSelected(opt.label) ? 'block' : 'hidden'}">
							<CheckIcon class="size-4" />
						</div> -->
						{opt.label}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.label {
		@apply text-white;
	}
	.trigger {
		@apply flex h-input-md min-w-48 items-center justify-between rounded-full border border-white bg-black px-md py-2 text-white;
	}
	.container {
		@apply z-10 flex flex-col overflow-y-auto rounded-sm bg-white p-1 shadow focus:!ring-0;
	}
	.group {
		@apply py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800;
	}

	.item {
		@apply relative flex h-input-md cursor-pointer items-center rounded-sm px-md text-neutral-800 hover:bg-black hover:text-white focus:z-10 focus:text-zinc-700 data-[highlighted]:bg-black data-[highlighted]:text-white data-[disabled]:opacity-50;
	}
	.check {
		position: absolute;
		left: theme(spacing.2);
		top: 50%;
		z-index: theme(zIndex.20);
		translate: 0 calc(-50% + 1px);
		color: theme(colors.zinc.500);
	}
</style>
