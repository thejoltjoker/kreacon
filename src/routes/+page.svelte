<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from './_components/HeroSection.svelte';
	import StepsSection from './_components/StepsSection.svelte';
	import SignUpSection from './_components/SignUpSection.svelte';
	import EventsSection from './_components/EventsSection.svelte';
	import ContentBlock from './_components/ContentBlock.svelte';
	import Button from '$lib/components/Button.svelte';
	import cowsFriendsImage from '../assets/images/cows-friends-001.png';
	import bugOrganImage from '../assets/images/bug-organ-002.png';
	import skeletonPileImage from '../assets/images/skeleton-pile-001.png';
	import AnimateOnScroll from '$lib/components/AnimateOnScroll.svelte';
	import { t } from '$lib/i18n';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<main class="mx-auto flex w-full flex-col items-center gap-8xl overflow-hidden md:gap-[20vh]">
	<HeroSection />
	<section class="flex w-full max-w-screen-xl flex-col gap-xl py-xl">
		<AnimateOnScroll id="animated-content-block-1">
			<ContentBlock alignment="right" imageUrl={skeletonPileImage} imageAlt="Monster" flipImageX>
				{#snippet content()}
					<h2 class="text-5xl">{$t('Rise to the Challenge')}</h2>
					<p class="text-lg">
						{$t(
							"Show what you're made of in our regular competitions. Push technical and creative limits, earn respect, and make your mark in the community."
						)}
					</p>
					<div>
						<Button variant="outline" href="/submit">{$t('Enter Competitions')}</Button>
					</div>
				{/snippet}
			</ContentBlock>
		</AnimateOnScroll>
		<AnimateOnScroll id="animated-content-block-2">
			<ContentBlock alignment="left" imageUrl={cowsFriendsImage} imageAlt="Monster">
				{#snippet content()}
					<h2 class="text-5xl">{$t('Join the Community')}</h2>
					<p class="text-lg">
						{$t(
							'Connect with passionate creators, form crews, collaborate on ambitious projects, and become part of something bigger than yourself.'
						)}
					</p>
					<div>
						<Button variant="outline" href="/entries">{$t('Meet Creators')}</Button>
					</div>
				{/snippet}
			</ContentBlock>
		</AnimateOnScroll>
		<AnimateOnScroll id="animated-content-block-3">
			<ContentBlock alignment="right" imageUrl={bugOrganImage} imageAlt="Monster" flipImageX>
				{#snippet content()}
					<h2 class="text-5xl">{$t('Show Your Love')}</h2>
					<p class="text-lg">
						{$t(
							'Support the creations that move you and help the best work shine. Your appreciation helps shape our vibrant community.'
						)}
					</p>
					<div>
						<Button variant="outline" href="/entries">{$t('Discover & Rate')}</Button>
					</div>
				{/snippet}
			</ContentBlock>
		</AnimateOnScroll>
	</section>
	<AnimateOnScroll id="animated-steps" class="flex w-full justify-center">
		<StepsSection />
	</AnimateOnScroll>
	<AnimateOnScroll id="animated-events" class="flex w-full justify-center">
		<EventsSection events={data.events} />
	</AnimateOnScroll>
	<AnimateOnScroll id="animated-signup" class="flex w-full justify-center">
		<SignUpSection />
	</AnimateOnScroll>
</main>
