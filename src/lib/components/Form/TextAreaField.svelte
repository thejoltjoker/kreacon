<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { cn } from '$lib/utils';
	import { Label } from 'bits-ui';
	import { XCircleIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { formFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface TextAreaFieldProps extends HTMLTextareaAttributes {
		label: string;
		field: FormPathLeaves<T>;
		labelProps?: Label.RootProps;
		/**
		 * Optional SuperForm instance. If not provided, will attempt to get from GenericForm context
		 * Must be provided if used outside of GenericForm
		 * @default undefined
		 */
		superform?: SuperForm<T>;
	}

	let {
		superform,
		field,
		labelProps,
		label,
		class: className,
		rows = 4,
		...props
	}: TextAreaFieldProps = $props();

	if (superform == null) {
		superform = getContext<SuperForm<T>>('superform');
		if (superform == null) {
			throw new Error('Failed to load form context');
		}
	}
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<div class="gap-xs flex flex-col">
	<Label.Root for={field} {...labelProps} class={cn('font-bold', labelProps?.class)}>
		{label}
	</Label.Root>
	<textarea
		name={field}
		id={field}
		{rows}
		class={cn(
			'rounded-form border-shade-600 bg-bg px-sm py-sm w-full resize-y border focus:outline-none',
			'focus:placeholder:text-shade-600 focus:border-violet-500 focus:ring-violet-500',
			'read-only:border-shade-400 read-only:bg-muted-background/50 read-only:text-shade-400',
			'disabled:border-shade-400 disabled:bg-muted-background/50 disabled:text-shade-400',
			$value && 'border-white',
			$errors && 'border-red-500 focus:border-red-500 focus:ring-red-500',
			className
		)}
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...props}
	></textarea>
	{#if $errors}
		<ul class="gap-xs flex flex-col text-sm">
			{#each $errors as error, i (i)}
				<li class="gap-2xs inline-flex items-center">
					<XCircleIcon class="text-destructive size-4" />
					{error}
				</li>
			{/each}
		</ul>
	{/if}
</div>
