<script lang="ts">
	import { page } from '$app/stores';
	import type { CreateEntrySchema } from '$lib/schemas/entry';
	import { getContext } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { type PageData } from '../$types';
	import type { MediaType } from '$lib/types/mediaTypes';
	import FileField from '$lib/components/Form/FileField.svelte';
	let superform = getContext<SuperForm<CreateEntrySchema>>('superform');
	let { form } = superform;
	let data = $page.data as PageData;
	let categories: PageData['events'][number]['categories'] = $state([]);
	$effect(() => {
		if (form == null) return;
		const event = data.events?.find((e) => e.eventId?.toString() === $form.eventId.toString());
		categories = event?.categories ?? [];
	});
	let mediaType: MediaType = $derived(
		categories.find((c) => String(c.id) === String($form.categoryId))?.mediaType ?? 'image'
	);
</script>

<!-- TODO Disable if no category picked -->
<div class="w-full">
	<FileField
		debug
		{mediaType}
		field="mediaId"
		label="Media"
		labelProps={{ class: 'text-2xl font-bold' }}
	/>
</div>
