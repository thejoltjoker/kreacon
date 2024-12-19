<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type IconProps, type Icon as IconType } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { Label } from 'bits-ui';
	import { XCircleIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { formFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
	import StyledInput, { type StyledInputProps } from './StyledInput.svelte';
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
		type = 'single',
		superform,
		field,
		labelProps,
		label,
		class: className,
		icon: Icon,
		iconProps,
		items,
		placeholder,
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

<div class="flex flex-col gap-xs">
	<Label.Root for={field} {...labelProps} class={cn('font-bold', labelProps?.class)}>
		{label}
	</Label.Root>
	<span class="relative">
		<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
		<StyledSelect
			{placeholder}
			name={field}
			id={field}
			{type}
			{items}
			class={cn($errors && 'input-invalid', className)}
			aria-invalid={$errors ? 'true' : undefined}
			bind:value={$value as any}
			{...$constraints}
		/>
		{#if Icon != null}
			<Icon
				{...iconProps}
				class={cn(
					'absolute right-md top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-all duration-300',
					iconProps?.class
				)}
			/>
		{/if}
	</span>
	{#if $errors}
		<ul class="flex flex-col gap-xs text-sm">
			{#each $errors as error}
				<li class="inline-flex items-center gap-2xs">
					<XCircleIcon class="size-4 text-destructive" />
					{error}
				</li>
			{/each}
		</ul>
	{/if}
</div>
