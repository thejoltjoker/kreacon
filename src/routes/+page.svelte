<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import HeroSection from './_components/HeroSection.svelte';
	import ContentBlock from './_components/ContentBlock.svelte';
	import EventHighlight from './_components/EventHighlight.svelte';
	import Button from '$lib/components/Button.svelte';
	import StepsSection from './_components/StepsSection.svelte';
	import SignUpSection from './_components/SignUpSection.svelte';
	import EventsSection from './_components/EventsSection.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<div class="flex min-h-full grow flex-col items-center">
	<div class="flex grow flex-col items-center justify-center">
		<HeroSection />
		<section class="flex max-w-screen-xl flex-col gap-xl">
			<!-- <ContentBlock alignment="left" imageUrl="/images/monster_001.png" imageAlt="Monster"
				>{#snippet content()}
					<h2 class="text-5xl">Show off your creative skills</h2>
					<p class="text-lg">
						Share your artwork, writing, music, or any creative work. Join our community of creators
						and get inspired by amazing submissions.
					</p>
					<div>
						<Button variant="outline">Submit your work</Button>
					</div>
				{/snippet}
			</ContentBlock>
			<ContentBlock alignment="right" imageUrl="/images/kreacon_00011_.png" imageAlt="Monster"
				>{#snippet content()}
					<h2 class="text-5xl">Let others know what you think</h2>
					<p class="text-lg">
						Rate and comment on submissions, engage in constructive discussions, and help creators
						improve through thoughtful feedback and encouragement.
					</p>
					<div>
						<Button variant="outline">Vote for submissions</Button>
					</div>
				{/snippet}
			</ContentBlock> -->

			<div class="px-4 py-16">
				<h2 class="mb-16 text-center text-4xl font-bold">Key Features</h2>
				<div class="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3">
					<div class="flex flex-col items-center text-center">
						<div class="mb-6 h-16 w-16">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="h-full w-full"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
							</svg>
						</div>
						<h3 class="mb-3 text-xl font-semibold">Submit your work</h3>
						<p class="text-gray-600">Quickly upload your photos with our intuitive interface.</p>
					</div>

					<div class="flex flex-col items-center text-center">
						<div class="mb-6 h-16 w-16">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="h-full w-full"
							>
								<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
								<polyline points="16 6 12 2 8 6" />
								<line x1="12" y1="2" x2="12" y2="15" />
							</svg>
						</div>
						<h3 class="mb-3 text-xl font-semibold">Vote for submissions</h3>
						<p class="text-gray-600">
							Share your photos with friends or the world in just a click.
						</p>
					</div>

					<div class="flex flex-col items-center text-center">
						<div class="mb-6 h-16 w-16">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="h-full w-full"
							>
								<circle cx="11" cy="11" r="8" />
								<line x1="21" y1="21" x2="16.65" y2="16.65" />
							</svg>
						</div>
						<h3 class="mb-3 text-xl font-semibold">Discover</h3>
						<p class="text-gray-600">
							Explore a vast collection of photos from talented photographers.
						</p>
					</div>
				</div>
			</div>
		</section>
		<StepsSection />
	</div>
</div>

<EventsSection events={data.events} />
<SignUpSection />
