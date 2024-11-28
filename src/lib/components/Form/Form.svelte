<script lang="ts" generics="T extends Record<string, unknown>">
	import type { SuperForm } from 'sveltekit-superforms';
	import { onDestroy, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Button from '../Button.svelte';

	interface Props extends HTMLAttributes<HTMLFormElement> {
		// eslint-disable-next-line no-undef
		form: SuperForm<T>;
		action?: string;
		children: Snippet;
		showSuccessAnimation?: boolean;
		disabled?: boolean;
		locked?: boolean;
		enctype?: 'multipart/form-data' | 'application/x-www-form-urlencoded' | 'text/plain';
	}

	let {
		form,
		action,
		children,
		showSuccessAnimation = $bindable(false),
		disabled = $bindable(false),
		locked = false,
		...formProps
	}: Props = $props();

	const { errors, enhance, submitting } = form;

	$effect(() => {
		disabled = locked || $submitting;
	});

	let successAnimationTimeout: ReturnType<typeof setTimeout> | undefined;

	onDestroy(() => {
		clearTimeout(successAnimationTimeout);
	});
</script>

<form
	{...formProps}
	method="POST"
	{action}
	use:enhance={{
		onSubmit(e) {
			console.log('onSubmit', e);
		},
		onUpdated({ form }) {
			if (form.valid) {
				showSuccessAnimation = true;
				successAnimationTimeout = setTimeout(() => (showSuccessAnimation = false), 5000);
			}
		}
	}}
>
	{@render children()}

	{#if !locked}
		<Button type="submit" {disabled}>
			{showSuccessAnimation ? 'Saved!' : 'Save'}
		</Button>
	{/if}

	{#if $errors._errors}
		<div class="center">
			{$errors._errors}
		</div>
	{/if}
</form>
