<script lang="ts">
	import MediaRow from './MediaRow.svelte';
	import FileField from '$lib/components/Form/FileField.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import { createEntrySchema, type CreateEntrySchema } from '$lib/schemas/entry';
	import { getContext } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import SubmittingTo from './SubmittingTo.svelte';
	let { form } = getContext<SuperForm<CreateEntrySchema>>('superform');
	let { isValid = $bindable() }: { isValid: boolean } = $props();
	$effect(() => {
		isValid = createEntrySchema
			.pick({
				mediaId: true,
				thumbnailId: true,
				proofId: true
			})
			.safeParse($form).success;
	});
</script>

<section>
	<SubmittingTo />
	<Divider class="my-xl" />
	<MediaRow />
	<div class="mt-sm w-full">
		<FileField
			customUploadUrl="/api/uploads/preview"
			mediaType="image"
			maxFileSize={1024 * 1024 * 10}
			field="previewId"
			label="Preview"
			labelProps={{ class: 'text-2xl font-bold' }}
		/>
	</div>
	<div class="mt-sm w-full">
		<FileField
			customUploadUrl="/api/uploads/proof"
			mediaType="archive"
			maxFileSize={1024 * 1024 * 512}
			field="proofId"
			label="Proof"
			labelProps={{ class: 'text-2xl font-bold' }}
		/>
	</div>
	<Divider class="my-xl" />
	<div class="gap-sm flex flex-col">
		<h3>What are the different files for?</h3>
		<h4>Media</h4>
		<p class="text-shade-300">
			This is the file that will be portrayed on the website for viewers to enjoy and vote on. Make
			sure it’s properly compressed. We suggest using a software like Handbrake to compress your
			video to fit within the requirements.
		</p>
		<h4>Preview</h4>
		<p class="text-shade-300">
			This is the image that will be portrayed on the website for viewers to enjoy and vote on. Make
			it pop, but don’t clickbait...
		</p>
		<h4>Proof</h4>
		<p class="text-shade-300">
			If the category requires it, you will upload a compressed file with suggested proof of
			authorship here.
		</p>
	</div>
</section>
