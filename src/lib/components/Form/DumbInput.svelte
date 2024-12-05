<script lang="ts">
	import { Label, type LabelRootProps } from 'bits-ui';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { type Icon as IconType } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	interface Props extends HTMLInputAttributes {
		label: string;
		labelProps?: Omit<LabelRootProps, 'for'>;
		icon?: typeof IconType;
		errors?: string[];
	}

	let {
		type = 'text',
		label,
		labelProps,
		name,
		value = $bindable(),
		icon: Icon,
		errors = [],
		...props
	}: Props = $props();
	let className = $derived(
		cn(
			'h-form w-full rounded-sm border bg-bg px-md focus:border-violet-500 focus:outline-none focus:ring-violet-500 focus:placeholder:text-muted-background-alt disabled:border-muted-foreground disabled:bg-muted-background',
			value != null && value !== '' ? 'border-white' : 'border-muted-foreground',
			errors.length > 0 && 'input-invalid',
			props.class
		)
	);
</script>

<Label.Root {...labelProps} for={name} class="relative flex w-full flex-col gap-xs">
	<span class="font-bold">{label}</span>
	<span class="relative">
		<input {...props} {type} {name} class={className} bind:value />
		{#if Icon != null}
			<Icon class="absolute right-md top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
		{/if}
	</span>

	{#each errors as error}
		<p class="error">{error}</p>
	{/each}
</Label.Root>
