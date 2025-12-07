<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { cn } from '$lib/utils';
	import { Label } from 'bits-ui';
	import { XCircleIcon, type IconProps, type Icon as IconType } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { formFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
	import StyledSelect, { type StyledSelectProps } from './StyledSelect.svelte';

	type SelectFieldProps = StyledSelectProps & {
		label: string;
		field: FormPathLeaves<T>;
		labelProps?: Label.RootProps;
		icon?: typeof IconType;
		iconProps?: IconProps;
		placeholder?: string;
		/**
		 * Optional SuperForm instance. If not provided, will attempt to get from GenericForm context
		 * Must be provided if used outside of GenericForm
		 * @default undefined
		 */
		superform?: SuperForm<T>;
	};

	let {
		class: className,
		field,
		icon: Icon,
		iconProps,
		items,
		label,
		labelProps,
		placeholder,
		superform,
		type = 'single',

		...props
	}: SelectFieldProps = $props();

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
	<span class="relative">
		<!-- eslint-disable @typescript-eslint/no-explicit-any -->
		<StyledSelect
			{items}
			{placeholder}
			{type}
			aria-invalid={$errors ? 'true' : undefined}
			bind:value={$value as any}
			class={cn($errors && 'input-invalid', className)}
			id={field}
			name={field}
			{...$constraints}
			{...props as any}
		/>
		{#if Icon != null}
			<Icon
				{...iconProps}
				class={cn(
					'right-md text-muted-foreground absolute top-1/2 size-5 -translate-y-1/2 transition-all duration-300',
					iconProps?.class
				)}
			/>
		{/if}
	</span>
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
