<script lang="ts">
	import SelectField from '$lib/components/Form/SelectField.svelte';
	import type { StyledSelectItem } from '$lib/components/Form/StyledSelect.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import Link from '$lib/components/Link.svelte';
	import { licenseCode } from '$lib/schemas/license';
	import { createSubmissionSchema, type CreateSubmissionSchema } from '$lib/schemas/submission';
	import { getContext } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	let { isValid = $bindable() }: { isValid: boolean } = $props();
	const licenses: StyledSelectItem[] = licenseCode.map((code) => ({
		label: code.toUpperCase(),
		value: code
	}));

	let { form } = getContext<SuperForm<CreateSubmissionSchema>>('superform');

	$effect(() => {
		isValid = createSubmissionSchema.pick({ title: true, license: true }).safeParse($form).success;
	});
</script>

<section>
	<div class="flex flex-col gap-xs">
		<TextField field="title" label="Title" labelProps={{ class: 'text-2xl font-bold' }} />
		<p class="text-shade-300">What do you call your masterpiece?</p>
	</div>
	<div class="flex flex-col gap-xs">
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
