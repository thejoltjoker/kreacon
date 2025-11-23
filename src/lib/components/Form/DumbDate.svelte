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
	let isChanged = $state(false);

	$effect(() => {
		isChanged = value != null;
	});
</script>

<DateField.Root bind:value bind:placeholder {...props}>
	<div class={cn('relative flex w-fit flex-col gap-sm', isChanged && 'text-white', props.class)}>
		<DateField.Label class="font-bold text-white">{labelText}</DateField.Label>
		<DateField.Input
			{name}
			class={cn(
				'group flex h-form w-fit select-none items-center rounded-form border border-muted-foreground bg-bg px-xs text-muted-foreground-alt transition-colors focus-within:border-primary focus-within:shadow-sm hover:border-white data-invalid:border-destructive',
				isChanged && 'border-white',
				inputProps?.class
			)}
			{...inputProps}
		>
			{#snippet children({ segments })}
				{#each segments as { part, value }}
					<div class="inline-block select-none">
						{#if part === 'literal'}
							<DateField.Segment {part} class="text-muted-foreground-alt">
								{value}
							</DateField.Segment>
						{:else}
							<DateField.Segment
								{part}
								class="rounded-xs px-2xs py-2xs focus:bg-muted-background focus:text-white focus-visible:outline-none! focus-visible:outline-0!"
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
							'ml-sm mr-2xs size-5 text-muted-foreground transition-colors group-focus-within:text-white',
							isChanged && 'text-white',
							iconProps?.class
						)}
					/>
				{/if}
			{/snippet}
		</DateField.Input>
	</div>
</DateField.Root>
