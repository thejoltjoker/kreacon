<script lang="ts">
	import SelectField from '$lib/components/Form/SelectField.svelte';
	import type { StyledSelectItem } from '$lib/components/Form/StyledSelect.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import Link from '$lib/components/Link.svelte';
	import { licenseCode } from '$lib/schemas/license';
	import { createEntrySchema, type CreateEntrySchema } from '$lib/schemas/entry';
	import { getContext } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import SubmittingTo from './SubmittingTo.svelte';
	import Divider from '$lib/components/Divider.svelte';
	let { isValid = $bindable() }: { isValid: boolean } = $props();
	const licenses: StyledSelectItem[] = licenseCode.map((code) => ({
		label: code.toUpperCase(),
		value: code
	}));

	let { form } = getContext<SuperForm<CreateEntrySchema>>('superform');

	$effect(() => {
		isValid = createEntrySchema.pick({ title: true, license: true }).safeParse($form).success;
	});
</script>

<section>
	<SubmittingTo />
	<Divider class="my-xl" />
	<div class="gap-xs flex flex-col">
		<TextField field="title" label="Title" labelProps={{ class: 'text-2xl font-bold' }} />
		<p class="text-shade-300">What do you call your masterpiece?</p>
	</div>
	<div class="gap-xs flex flex-col">
		<SelectField
			type="single"
			field="license"
			label="License"
			labelProps={{ class: 'text-2xl font-bold' }}
			items={licenses}
		/>
		<div class="text-shade-300">
			Confused? Use <Link href="https://chooser-beta.creativecommons.org" target="_blank">
				this tool
			</Link> to help you pick a license.
		</div>
	</div>
</section>
