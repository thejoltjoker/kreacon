<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import Select from '$lib/components/Select.svelte';
	import SuperDebug from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	export let data: PageData;
	const { form, errors, constraints, message } = superForm(data.form);
	console.log(data);
</script>

<SuperDebug data={$form} />

<form method="POST" class="flex flex-col gap-sm">
	<input type="file" name="file" id="file" />
	<InputField label="Title" name="title" />
	<Select label="Category" options={data.categoriesOptions} />

	<Button type="submit">Create</Button>
</form>
