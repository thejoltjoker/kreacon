<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { SelectFile } from '$lib/server/db/schema/file';
	import { PlayIcon, PauseIcon } from 'lucide-svelte';

	let { media }: { media: SelectFile } = $props();

	let audioElement: HTMLAudioElement;
	let currentTime = $state(0);
	let duration = $state(0);
	let isPaused = $state(true);

	const formatTime = (time: number) => {
		if (isNaN(time)) return '...';
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	const handleSeek = (e: PointerEvent, slider: HTMLDivElement) => {
		const { left, width } = slider.getBoundingClientRect();
		const position = Math.max(0, Math.min(1, (e.clientX - left) / width));
		currentTime = position * duration;
	};

	const initializeSeek = (e: PointerEvent) => {
		const slider = e.currentTarget as HTMLDivElement;
		handleSeek(e, slider);

		const moveHandler = (e: PointerEvent) => handleSeek(e, slider);
		window.addEventListener('pointermove', moveHandler);
		window.addEventListener(
			'pointerup',
			() => {
				window.removeEventListener('pointermove', moveHandler);
			},
			{ once: true }
		);
	};
</script>

<div class="card w-full">
	<div
		class:isPaused
		class="flex w-full items-center gap-lg"
		role="region"
		aria-label="Audio player"
	>
		<audio
			bind:this={audioElement}
			src={media.url}
			bind:currentTime
			bind:duration
			bind:paused={isPaused}
			onended={() => {
				currentTime = 0;
			}}
		></audio>
		<Button
			variant="outline"
			size="icon"
			onclick={() => (isPaused = !isPaused)}
			aria-label={isPaused ? 'Play audio' : 'Pause audio'}
		>
			{#if isPaused}
				<PlayIcon />
			{:else}
				<PauseIcon />
			{/if}
		</Button>

		<div class="flex w-full items-center gap-lg">
			<div class="font-mono" role="timer">{formatTime(currentTime)}</div>
			<div
				class="slider h-xs w-full cursor-pointer overflow-hidden rounded-full bg-shade-900"
				role="slider"
				aria-label="Audio progress"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow={Math.round((currentTime / duration) * 100)}
				onpointerdown={initializeSeek}
			>
				<div class="progress" style="--progress: {currentTime / duration}%"></div>
			</div>
			<div class="font-mono">{duration ? formatTime(duration) : '--:--'}</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.progress {
		width: calc(100 * var(--progress));
		height: 100%;
		@apply bg-white;
	}
</style>
