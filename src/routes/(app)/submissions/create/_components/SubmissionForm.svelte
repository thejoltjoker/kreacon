<script lang="ts">
	import { page } from '$app/stores';
	import FileField from '$lib/components/Form/FileField.svelte';
	import GenericForm from '$lib/components/Form/GenericForm.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import { Accordion } from 'bits-ui';
	import CategoryRow from './CategoryRow.svelte';
	import EventRow from './EventRow.svelte';
	import MediaRow from './MediaRow.svelte';
	import Button from '$lib/components/Button.svelte';

	import { ArrowBigDownDashIcon, FacebookIcon, PlayIcon } from 'lucide-svelte';
	import AudioPlayer from '../../[id]/_components/AudioPlayer.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	let openRows = $state(['accordion-event']);
	let mockMedia = {
		id: 1,
		type: 'audio' as const,
		url: 'https://stream.mux.com/O4h5z00885HEucNNa1rV02wZapcGp01FXXoJd35AHmGX7g/audio.m4a',
		filename: 'audio.m4a',
		alt: null,
		createdAt: new Date(),
		updatedAt: new Date()
	};
	let progress = $state(0);
	function fileUploadWithProgress(input: Parameters<SubmitFunction>[0]) {
		return new Promise<XMLHttpRequest>((resolve) => {
			const xhr = new XMLHttpRequest();

			xhr.upload.onprogress = function (event) {
				progress = Math.round((100 * event.loaded) / event.total);
			};

			xhr.onload = function () {
				if (xhr.readyState === xhr.DONE) {
					progress = 0;
					resolve(xhr);
				}
			};

			xhr.open('POST', input.action, true);
			xhr.send(input.formData);
		});
	}

	// const { form, enhance } = superForm(data.form, {
	// 	onSubmit({ customRequest }) {
	// 		customRequest(fileUploadWithProgress);
	// 	}
	// });
</script>

<!-- TODO Store state in url -->
<!-- TODO Show loading state -->
{progress}
<Accordion.Root bind:value={openRows} type="multiple">
	<!-- {JSON.stringify(openRows)} -->
	<GenericForm
		debug
		data={$page.data.form}
		class="my-3xl gap-3xl px-sm md:px-xl"
		options={{ onSubmit: ({ customRequest }) => customRequest(fileUploadWithProgress) }}
	>
		<EventRow bind:openRows />
		<CategoryRow bind:openRows />
		<TextField field="title" label="Title" labelProps={{ class: 'text-2xl font-bold' }} />
		<MediaRow />
		<div class="h-[340px] w-full">
			<FileField
				mediaType="image"
				maxFileSize={1024 * 1024 * 2}
				field="thumbnail"
				label="Thumbnail"
				labelProps={{ class: 'text-2xl font-bold' }}
			/>
		</div>
		<Button type="submit">Submit</Button>
	</GenericForm>
</Accordion.Root>
