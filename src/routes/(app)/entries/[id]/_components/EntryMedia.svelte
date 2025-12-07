<script lang="ts">
	import type { PageData } from '../$types';

	type Media = NonNullable<PageData['entry']>['media'];
	export let media: Media | null | undefined;
</script>

<section class="media">
	<img src={`${media?.url}`} alt={media?.name} />
</section>

<style lang="postcss">
	@reference "../../../../../app.css";

	.media {
		@apply w-fit;
		& img {
			@apply max-h-[90vh] max-w-full rounded-md;
		}
	}
</style>
