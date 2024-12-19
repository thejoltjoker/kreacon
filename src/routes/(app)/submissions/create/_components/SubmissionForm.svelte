<script lang="ts">
	import { page } from '$app/stores';
	import FileField from '$lib/components/Form/FileField.svelte';
	import GenericForm from '$lib/components/Form/GenericForm.svelte';
	import SelectField from '$lib/components/Form/SelectField.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import { t } from '$lib/i18n';
	import { Accordion } from 'bits-ui';
	import { ChevronDownIcon } from 'lucide-svelte';
	import CategoryRow from './CategoryRow.svelte';
	import SubmissionFormRow from './SubmissionFormRow.svelte';
	import EventRow from './EventRow.svelte';

	let openRows = $state(['accordion-event']);

	$effect(() => {});
</script>

<Accordion.Root bind:value={openRows} type="multiple">
	<!-- {JSON.stringify(openRows)} -->
	<GenericForm debug data={$page.data.form} class="my-3xl gap-3xl">
		<EventRow bind:openRows />
		<CategoryRow bind:openRows />
		<TextField field="title" label="Title" labelProps={{ class: 'text-2xl font-bold' }} />
		<div class="h-[200px] w-full">
			<FileField
				accept={['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp']}
				field="file"
				label="File"
				labelProps={{ class: 'text-2xl font-bold' }}
			/>
		</div>
	</GenericForm>
</Accordion.Root>
