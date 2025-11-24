<script lang="ts">
	import { cn } from '$lib/utils';
	import { Label, type LabelRootProps } from 'bits-ui';
	import { type IconProps, type Icon as IconType } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type {
		HTMLInputAttributes,
		HTMLInputTypeAttribute,
		HTMLTextareaAttributes
	} from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	interface BaseProps {
		label?: string | Snippet;
		labelProps?: Omit<LabelRootProps, 'for'>;
		icon?: typeof IconType;
		iconProps?: IconProps;
		errors?: string[];
		variant?: 'default' | 'ghost';
		type?: HTMLInputTypeAttribute & HTMLTextAreaElement['type'];
		hint?: string;
	}

	type InputProps = BaseProps & {
		type?: Exclude<HTMLInputTypeAttribute, HTMLTextAreaElement['type']>;
		elementRef?: HTMLInputElement;
	} & HTMLInputAttributes;

	type TextareaProps = BaseProps & {
		type: 'textarea';
		elementRef?: HTMLTextAreaElement;
	} & HTMLTextareaAttributes;

	type Props =
		| (Omit<InputProps, 'type'> & { type?: Exclude<HTMLInputTypeAttribute, 'textarea'> })
		| (Omit<TextareaProps, 'type'> & { type: 'textarea' });

	let {
		type = 'text',
		label,
		labelProps,
		name,
		hint,
		value = $bindable(),
		icon: Icon,
		errors = [],
		variant = 'default',
		elementRef = $bindable(),
		iconProps,
		...props
	}: Props = $props();

	const inputVariants = tv({
		base: cn('w-full rounded-sm border px-md focus:outline-none', type !== 'textarea' && 'h-form'),
		variants: {
			variant: {
				default:
					'focus:border-violet-500 bg-bg focus:ring-violet-500 focus:placeholder:text-muted-background-alt disabled:border-muted-foreground disabled:bg-muted-background/50 disabled:text-muted-foreground-alt',
				ghost: 'border-transparent! bg-transparent rounded-none p-0! text-muted-foreground-alt'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	let className = $derived(
		cn(
			inputVariants({ variant }),
			value != null && value !== '' && variant !== 'ghost'
				? 'border-white'
				: 'border-muted-foreground',
			errors.length > 0 && 'input-invalid',
			props.class
		)
	);
</script>

<div class="gap-sm relative flex w-full flex-col select-text">
	<Label.Root {...labelProps} for={name} class={cn(label == null && 'hidden', labelProps?.class)}>
		{#if typeof label === 'string'}
			<span class="font-bold">{label}</span>
		{:else if label != null}
			{@render label()}
		{/if}
	</Label.Root>
	{#if hint}
		<span class="-mt-2xs text-shade-400 leading-none">{hint}</span>
	{/if}
	<span class="relative">
		{#if type === 'textarea'}
			{@const textareaProps = props as TextareaProps}
			<textarea
				{...textareaProps}
				rows={textareaProps.rows ?? 3}
				{name}
				class={className}
				bind:value
				bind:this={elementRef}
			>
			</textarea>
			{#if Icon != null}
				<Icon
					{...iconProps}
					class={cn(
						'right-md text-muted-foreground absolute top-1/2 size-5 -translate-y-1/2 transition-all duration-300',
						iconProps?.class
					)}
				/>
			{/if}
		{:else}
			{@const inputProps = props as InputProps}
			<input {...inputProps} {type} {name} class={className} bind:value bind:this={elementRef} />
			{#if Icon != null}
				<Icon
					{...iconProps}
					class={cn(
						'right-md text-muted-foreground absolute top-1/2 size-5 -translate-y-1/2 transition-all duration-300',
						iconProps?.class
					)}
				/>
			{/if}
		{/if}
	</span>

	{#each errors as error, i (i)}
		<p class="error">{error}</p>
	{/each}
</div>
