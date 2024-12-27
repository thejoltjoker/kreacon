<script>
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import { _ } from 'svelte-i18n';
	import EventHighlight from './EventHighlight.svelte';
	import { getEventStatus } from '$lib/helpers/eventStatus';
	import { fade } from 'svelte/transition';
	import monsterImage from '../../assets/images/monster.png';
	import { t } from '$lib/i18n';
	let event = $derived.by(() => {
		return $page.data.events[0];
	});

	let mounted = $state(false);
	$effect(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<section
		class="flex justify-center px-sm lg:pb-[5vh] lg:pt-[25vh]"
		transition:fade={{ delay: 100, duration: 500 }}
	>
		<div class="flex flex-wrap items-center justify-center gap-6xl">
			<div class="flex items-center justify-center">
				<img src={monsterImage} width="360" height="360" alt="Monster" />
			</div>
			<div class="flex flex-col items-start gap-xl text-left">
				{#if event != null}
					<EventHighlight
						name={event.name}
						href={`/events/${event.slug}`}
						status={getEventStatus(event)}
					/>
				{/if}
				<h1 class="max-w-3xl text-balance text-4xl lg:text-7xl">
					<!-- TODO Use $t() -->
					{$_('hero.title', { default: 'Show off your creative skills' })}
				</h1>
				<p class="max-w-3xl text-neutral-200 lg:text-xl">
					{$t('Join our creative competition and showcase your talent.')}
					<br />
					{$t('Let your imagination run wild and stand a chance to win exciting prizes.')}
				</p>
				<div class="flex items-center justify-center gap-4 sm:flex-row">
					<Button href="/submissions">{$_('enter_now', { default: 'Enter now' })}</Button>
					<Button variant="ghost">{$_('learn_more', { default: 'Learn more' })}</Button>
				</div>
			</div>
		</div>
	</section>
{/if}
