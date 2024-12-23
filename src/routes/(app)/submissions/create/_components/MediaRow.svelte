<script lang="ts">
	import { page } from '$app/stores';
	import FileField from '$lib/components/Form/FileField.svelte';
	import type { CreateSubmissionSchema } from '$lib/schemas/submission';
	import { type MediaType } from '$lib/types/mediaTypes';
	import { getContext } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { PageData } from '../$types';
	let { form } = getContext<SuperForm<CreateSubmissionSchema>>('superform');
	let data = $page.data as PageData;
	let categories: PageData['events'][number]['categories'] = $state([]);
	$effect(() => {
		const event = data.events?.find((e) => e.eventId?.toString() === $form.eventId.toString());
		categories = event?.categories ?? [];
	});
	let mediaType: MediaType = $derived(
		categories.find((c) => String(c.id) === String($form.categoryId))?.mediaType ?? 'image'
	);
</script>

<!-- TODO Disable if no category picked -->
<div class="w-full">
	<FileField {mediaType} field="media" label="Media" labelProps={{ class: 'text-2xl font-bold' }} />
</div>
