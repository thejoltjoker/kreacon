<script lang="ts" generics="T extends Record<string, unknown>">
	import type { SuperForm } from 'sveltekit-superforms';
	import { onDestroy, type Snippet } from 'svelte';

	interface Props {
		// eslint-disable-next-line no-undef
		form: SuperForm<T>;
		action?: string;
		children: Snippet;

		showSuccessAnimation?: boolean;
		disabled?: boolean;
		locked?: boolean;
	}

	let {
		form,
		action,
		children,
		showSuccessAnimation = $bindable(false),
		disabled = $bindable(false),
		locked = false
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
		<button type="submit" class="btn-b" {disabled}>
			{showSuccessAnimation ? 'Saved!' : 'Save'}
		</button>
	{/if}

	{#if $errors._errors}
		<div class="center">
			{$errors._errors}
		</div>
	{/if}
</form>
