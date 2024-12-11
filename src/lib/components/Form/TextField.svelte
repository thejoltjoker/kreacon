<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { Label } from 'bits-ui';
	import { formFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
	import StyledInput, { type StyledInputProps } from './StyledInput.svelte';
	import { cn } from '$lib/utils';

	interface TextFieldProps extends StyledInputProps {
		superform: SuperForm<T>;
		field: FormPathLeaves<T>;
		labelProps?: Label.RootProps;
		label: string;
	}

	let {
		superform,
		field,
		labelProps,
		label,
		class: className,
		...props
	}: TextFieldProps = $props();

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<div class="flex flex-col gap-xs">
	<Label.Root for={field} {...labelProps} class={cn('font-bold', labelProps?.class)}>
		{label}
	</Label.Root>
	<StyledInput
		name={field}
		type="text"
		class={cn($errors && 'input-invalid', className)}
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...props}
	/>
	{#if $errors}<span class="error">{$errors}</span>{/if}
</div>
