<script lang="ts">
	import MediaRow from './MediaRow.svelte';
	import FileField from '$lib/components/Form/FileField.svelte';
	import Divider from '$lib/components/Divider.svelte';
	// TODO Add proof field
</script>

<section>
	<MediaRow />
	<div class="w-full">
		<FileField
			mediaType="image"
			maxFileSize={1024 * 1024 * 2}
			field="thumbnailId"
			label="Thumbnail"
			labelProps={{ class: 'text-2xl font-bold' }}
		/>
	</div>
	<!-- <FileField
		mediaType="archive"
		maxFileSize={1024 * 1024 * 2}
		field="proofId"
		label="Proof"
		labelProps={{ class: 'text-2xl font-bold' }}
	/> -->
	<Divider class="my-xl" />
	<div class="flex flex-col gap-sm">
		<h3>What are the different files for?</h3>
		<h4>Media</h4>
		<p class="text-shade-300">
			This is the file that will be portrayed on the website for viewers to enjoy and vote on. Make
			sure it’s properly compressed. We suggest using a software like Handbrake to compress your
			video to fit within the requirements.
		</p>
		<h4>Thumbnail</h4>
		<p class="text-shade-300">
			This is the image that will be portrayed on the website for viewers to enjoy and vote on. Make
			it pop, but don’t clickbait...
		</p>
		<!-- <h4>Proof</h4>
		<p class="text-shade-300">
			If the category requires it, you will upload a compressed file with suggested proof of
			authorship here.
		</p> -->
	</div>
</section>
