<script lang="ts">
	import type { PageData } from '../$types';

	type Media = NonNullable<PageData['submission']>['media'];
	export let media: Media | null | undefined;
</script>

<section class="media">
	<img src={`/${media?.url}`} alt={media?.alt} />
</section>

<style lang="postcss">
	.media {
		@apply w-fit;
		& img {
			@apply max-h-[90vh] max-w-full rounded-md;
		}
	}
</style>
