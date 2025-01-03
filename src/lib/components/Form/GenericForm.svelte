<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { cn } from '$lib/utils';
	import { setContext, type Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { SuperForm, SuperValidated } from 'sveltekit-superforms';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import type { FormOptions } from 'sveltekit-superforms/client';
	import { setEnctype } from './enctype.svelte';

	interface GenericFormProps extends Omit<HTMLFormAttributes, 'children'> {
		children: Snippet<
			[
				superform: SuperForm<T>
				// form: T,
				// message: SuperFormMessage | undefined,
				// errors: ValidationErrors<T>,
				// allErrors: { path: string; messages: string[] }[],
				// delayed: boolean
			]
		>;
		/**
		 * superValidated form data from server
		 * @default undefined
		 */
		data: SuperValidated<T>;
		dataType?: 'form' | 'json';
		invalidateAll?: boolean;
		onFormValid?: () => void;
		options?: FormOptions<T>;
		debug?: boolean;
	}

	let {
		method = 'POST',
		data,
		dataType = 'form',
		invalidateAll = true, // Set to false if using multiple forms on the same page
		children,
		onFormValid,
		class: className,
		options,
		debug = false,
		enctype: enctypeOverride,
		...props
	}: GenericFormProps = $props();

	export const superform = superForm(data, {
		dataType,
		invalidateAll,
		onUpdated({ form }) {
			if (form.valid) {
				onFormValid?.();
			}
		},
		...options
	});
	const { form, enhance } = superform;

	let enctype = setEnctype(enctypeOverride);

	setContext('superform', superform);
</script>

<form
	{method}
	use:enhance
	class={cn('flex w-full flex-col gap-sm', className)}
	datatype={dataType}
	enctype={$enctype}
	{...props}
>
	{#if debug}
		<SuperDebug data={$form}></SuperDebug>
	{/if}
	<!-- Magic way is to just rely on context,
		but can be used with Svelte 5 snippets like this:
		{#snippet children(superform)}
			<TextField {superform} type="text" field="username" label="Username" />
		{/snippet} -->
	{@render children(superform)}
</form>
