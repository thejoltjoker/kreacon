<script lang="ts">
	import { cn } from '$lib/utils';
	import { DateField, type WithoutChildrenOrChild } from 'bits-ui';
	import { Icon as IconType, type IconProps } from 'lucide-svelte';
	type Props = WithoutChildrenOrChild<DateField.RootProps> & {
		labelText: string;
		name: string;
		class?: string;
		icon?: typeof IconType;
		iconProps?: IconProps;
		inputProps?: DateField.InputProps;
	};

	let {
		value = $bindable(),
		placeholder,
		name,
		labelText,
		icon: Icon,
		iconProps,
		inputProps,
		...props
	}: Props = $props();
	let isChanged = $derived(value != null);
</script>

<DateField.Root bind:value bind:placeholder {...props}>
	<div class={cn('gap-sm relative flex w-fit flex-col', isChanged && 'text-white', props.class)}>
		<DateField.Label class="font-bold text-white">{labelText}</DateField.Label>
		<DateField.Input
			{name}
			class={cn(
				'group h-form rounded-form border-muted-foreground bg-bg px-xs text-muted-foreground-alt focus-within:border-primary data-invalid:border-destructive flex w-fit items-center border transition-colors select-none focus-within:shadow-sm hover:border-white',
				isChanged && 'border-white',
				inputProps?.class
			)}
			{...inputProps}
		>
			{#snippet children({ segments })}
				{#each segments as { part, value }, i (i)}
					<div class="inline-block select-none">
						{#if part === 'literal'}
							<DateField.Segment {part} class="text-muted-foreground-alt">
								{value}
							</DateField.Segment>
						{:else}
							<DateField.Segment
								{part}
								class="px-2xs py-2xs focus:bg-muted-background rounded-xs focus:text-white focus-visible:outline-0! focus-visible:outline-none!"
							>
								{value}
							</DateField.Segment>
						{/if}
					</div>
				{/each}
				{#if Icon != null}
					<Icon
						{...iconProps}
						class={cn(
							'ml-sm mr-2xs text-muted-foreground size-5 transition-colors group-focus-within:text-white',
							isChanged && 'text-white',
							iconProps?.class
						)}
					/>
				{/if}
			{/snippet}
		</DateField.Input>
	</div>
</DateField.Root>
