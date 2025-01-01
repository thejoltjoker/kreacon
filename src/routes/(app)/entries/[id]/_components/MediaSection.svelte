<script lang="ts">
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import { getMediaTypeForMime } from '$lib/helpers/mediaTypes';
	import type { PageData } from '../$types';

	let { entry }: { entry: NonNullable<PageData['entry']> } = $props();
</script>

<section id="entry-media" class="flex flex-col items-center">
	{#if entry.media}
		{@const mediaType = getMediaTypeForMime(entry.media.type)}
		{#if mediaType === 'image'}
			<img
				src={`${entry.media?.url}`}
				alt={entry.title}
				class="h-full w-full overflow-hidden rounded-form object-cover object-center"
			/>
		{:else if mediaType === 'video'}
			<VideoPlayer src={entry.media.url} poster={entry.preview?.url} />
		{:else if mediaType === 'audio'}
			<AudioPlayer src={entry.media.url} poster={entry.preview?.url} />
		{/if}
	{:else}
		<p>No media found</p>
	{/if}
</section>
