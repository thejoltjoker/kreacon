<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { FormPathLeaves } from 'sveltekit-superforms';

	interface Props {
		// eslint-disable-next-line no-undef
		form: SuperForm<T>;
		// eslint-disable-next-line no-undef
		field: FormPathLeaves<T>;
		disabled: boolean;
	}

	const { form, field, type = 'text', disabled }: Props = $props();
	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<input type="file" name={field} bind:value={$value} {...$constraints} {disabled} />
<!-- TODO Display errors -->
{$errors}
