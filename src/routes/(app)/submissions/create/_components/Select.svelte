<script lang="ts" generics="T extends Record<string, unknown>">
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	interface Props {
		form: SuperForm<T>;
		field: FormPathLeaves<T>;
		disabled: boolean;
		options: { label: string; value: string }[];
	}

	const { form, field, disabled, options }: Props = $props();
	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<select name="category" bind:value={$value} {disabled} {...$constraints}>
	{#each options as o}
		<option value={o.value} selected={o.value == $value}>
			{o.label}
		</option>
	{/each}
</select>
<!-- TODO Display errors -->
{$errors}
