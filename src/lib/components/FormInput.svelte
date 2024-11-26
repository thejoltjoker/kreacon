<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { Label } from 'bits-ui';
	import { _ } from 'svelte-i18n';

	import { formFieldProxy } from 'sveltekit-superforms';
	import type { SuperForm, FormPathLeaves } from 'sveltekit-superforms';

	let _class = '';
	export { _class as class };

	export let label = '';
	export let field: FormPathLeaves<T>;
	export let superform: SuperForm<T>;
	export let type: 'text' | 'email' | 'password' = 'text';

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<Label.Root class="label flex flex-col gap-xs font-bold" for={field}>
	{$_(label, { default: label })}

	<div class="control">
		<input
			{type}
			class={'input ' + _class}
			name={field}
			aria-invalid={$errors ? 'true' : undefined}
			placeholder=""
			bind:value={$value}
			{...$constraints}
			{...$$restProps}
		/>
	</div>
	{#if $errors}
		<p class="help is-danger">{$errors}</p>
	{/if}
</Label.Root>

<style>
	.is-danger {
		color: red;
	}

	input:not(:placeholder-shown):invalid {
		box-shadow: inset 0px 0px 3px 1px #f00;
	}
</style>
