<script lang="ts">
	import 'media-chrome';

	interface Props {
		url: string;
	}
	let { url }: Props = $props();
</script>

<media-controller audio class="w-full rounded-form border border-shade-600 bg-shade-900 p-md">
	<audio slot="media" src={url}></audio>
	<media-control-bar class="flex h-full w-full flex-1 grow items-center">
		<media-play-button
			class="aspect-square size-form rounded-full border border-white bg-shade-800"
		>
		</media-play-button>
		<media-time-range class="grow px-sm"></media-time-range>

		<media-time-display
			notoggle
			showduration
			class="bg-none p-0 text-right font-mono text-sm font-normal"
		></media-time-display>
	</media-control-bar>
</media-controller>

<style lang="postcss">
	media-time-range {
		--media-range-bar-color: theme('colors.white');
		--media-range-thumb-opacity: 0;
		--media-range-track-background: theme('colors.shade.600');
		--media-range-track-border-radius: 9999px;
		--media-range-track-height: theme('spacing.xs');
	}

	media-controller {
		--media-font-weight: theme('fontWeight.bold');
		--media-font-size: theme('fontSize.sm');
		--media-font-family: theme('fontFamily.sans');
		--media-time-range-buffered-color: transparent;
		--media-primary-color: theme('colors.white');
		--media-secondary-color: theme('colors.shade.700');
		--media-control-background: transparent;
		--media-control-hover-background: transparent;
		--media-range-bar-color: theme('colors.white');
		--media-range-thumb-opacity: 1;
		--media-range-track-background: theme('colors.shade.950');
		--media-range-track-border-radius: 9999px;
	}
	/* media-tooltip {
		--media-font-weight: theme('fontWeight.bold');
		--media-font-size: theme('fontSize.sm');
		--media-font-family: theme('fontFamily.sans');
		--media-tooltip-background-color: red;
	} */
</style>
