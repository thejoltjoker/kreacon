<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import BraggingSlide from './slides/BraggingSlide.svelte';
	import ChallengesSlide from './slides/ChallengesSlide.svelte';
	import ChangesSlide from './slides/ChangesSlide.svelte';
	import DemoSlide from './slides/DemoSlide.svelte';
	import IntroSlide from './slides/IntroSlide.svelte';
	import TechStackSlide from './slides/TechStackSlide.svelte';
	import WhySlide from './slides/WhySlide.svelte';

	const slides: Record<number, typeof IntroSlide> = {
		0: IntroSlide,
		1: WhySlide,
		2: ChallengesSlide,
		3: BraggingSlide,
		4: TechStackSlide,
		5: ChangesSlide,
		6: DemoSlide
	};
	let currentSlideNumber = $state(Number($page.url.searchParams.get('slide') ?? 0));
	let transitionDuration = 300;
	let CurrentSlide = $derived(slides[currentSlideNumber]);

	const updateSearchParams = (slide: number) => {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('slide', slide.toString());
		goto(`?${params.toString()}`);
	};

	const nextSlide = () => {
		if (currentSlideNumber < Object.keys(slides).length - 1) {
			currentSlideNumber++;
			updateSearchParams(currentSlideNumber);
		}
	};

	const prevSlide = () => {
		if (currentSlideNumber > 0) {
			currentSlideNumber--;
			updateSearchParams(currentSlideNumber);
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowRight') {
			nextSlide();
		}
		if (event.key === 'ArrowLeft') {
			prevSlide();
		}
	};
</script>

<svelte:window onkeydown={handleKeydown} />

{#key currentSlideNumber}
	<div
		class="absolute left-0 top-0 z-[150] flex h-screen w-screen flex-col items-center justify-center"
		in:fade={{ delay: transitionDuration, duration: transitionDuration }}
		out:fade={{ duration: transitionDuration }}
	>
		<CurrentSlide />
	</div>
{/key}
<div
	class="absolute left-0 top-0 z-[100] flex h-screen w-screen flex-col items-center justify-center bg-bg"
></div>
<div class="horizon">
	<div
		class="fixed bottom-0 left-0 z-[110] h-[50vh] w-screen bg-gradient-to-t from-[hsl(246,30%,9%)]"
	></div>
</div>
