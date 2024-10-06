<script lang="ts">
	import type { SelectOptions } from '$lib/components/Select/Select.types';
	import { createSelect, melt } from '@melt-ui/svelte';
	import { CheckIcon, ChevronDownIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	let labelText: string;
	export { labelText as label };
	export let options: SelectOptions;

	const {
		elements: { trigger, menu, option, group, groupLabel, label },
		states: { selectedLabel, open },
		helpers: { isSelected }
	} = createSelect<string>({
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
	<label class="debug-green font-bold" use:melt={$label}>{labelText}</label>
	<button
		class="flex items-center justify-between rounded-sm border border-white px-sm py-xs"
		use:melt={$trigger}
		aria-label="Food"
	>
		{$selectedLabel}
		{!$selectedLabel
			? options.length < 1
				? $_('form.no_options_available')
				: $_('form.select_one')
			: ''}
		<ChevronDownIcon class="size-5" />
	</button>

	{#if $open}
		<div
			class="flex flex-col rounded-sm border border-white bg-black px-sm py-4"
			use:melt={$menu}
			transition:fade={{ duration: 150 }}
		>
			{#if options.length < 1}
				<div class="flex flex-col" use:melt={$group('no-options')}>
					<div class="font-bold text-neutral-500" use:melt={$groupLabel('no-options')}>
						No options available
					</div>
				</div>
			{/if}
			{#each Object.entries(options) as [key, arr]}
				{#if arr.options}
					<div class="flex flex-col" use:melt={$group(key)}>
						<div class="font-bold text-neutral-500" use:melt={$groupLabel(key)}>
							{arr.label}
						</div>
					</div>
					<div class="flex flex-col">
						{#each arr.options as { value, label, isDisabled }}
							<div
								class="relative cursor-pointer rounded-sm px-xs py-xs pl-8 text-white focus:z-10 hover:enabled:bg-white data-[highlighted]:bg-neutral-200 data-[highlighted]:text-neutral-900 data-[disabled]:opacity-50"
								use:melt={$option({ value, label, disabled: isDisabled })}
							>
								<div class="check {$isSelected(value) ? 'block' : 'hidden'}">
									<CheckIcon class="size-4" />
								</div>

								{label}
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex flex-col">
						<div
							class="relative cursor-pointer rounded-sm px-xs py-xs pl-8 text-white focus:z-10 hover:enabled:bg-white data-[highlighted]:bg-neutral-200 data-[highlighted]:text-neutral-900 data-[disabled]:opacity-50"
							use:melt={$option({ value: arr.value, label: arr.label, disabled: arr.isDisabled })}
						>
							<div class="check {$isSelected(arr.value) ? 'block' : 'hidden'}">
								<CheckIcon class="size-4" />
							</div>

							{label}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 z-20 -translate-y-1/2 text-neutral-500;
	}
</style>
