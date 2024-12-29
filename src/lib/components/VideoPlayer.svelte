<script lang="ts">
	import 'media-chrome';
	interface VideoPlayerProps {
		src: string;
		poster: string;
	}
	let { src, poster }: VideoPlayerProps = $props();
</script>

<media-controller>
	<video slot="media" {poster} {src}>
		<track kind="captions" />
	</video>
	<media-control-bar>
		<media-play-button></media-play-button>
		<media-mute-button></media-mute-button>
		<media-time-range></media-time-range>
		<media-time-display></media-time-display>
		<media-fullscreen-button></media-fullscreen-button>
	</media-control-bar>
</media-controller>
