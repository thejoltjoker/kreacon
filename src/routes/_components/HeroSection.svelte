<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
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
	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<section
		class="px-sm flex justify-center lg:pt-[25vh] lg:pb-[5vh]"
		transition:fade={{ delay: 100, duration: 500 }}
	>
		<div class="gap-6xl flex flex-wrap items-center justify-center">
			<div class="flex items-center justify-center">
				<img src={monsterImage} width="360" height="360" alt="Monster" />
			</div>
			<div class="gap-xl flex flex-col items-start text-left">
				{#if event != null}
					<EventHighlight
						name={event.name}
						href={`/events/${event.slug}`}
						status={getEventStatus(event)}
					/>
				{/if}
				<h1 class="text-4xl text-balance lg:text-7xl">
					<!-- TODO Use $t() -->
					{$_('hero.title', { default: 'Show off your creative skills' })}
				</h1>
				<p class="text-neutral-200 lg:text-xl">
					{$t('Join our creative competition and showcase your talent.')}
					<br />
					{$t('Let your imagination run wild and stand a chance to win exciting prizes.')}
				</p>
				<div class="flex items-center justify-center gap-4 sm:flex-row">
					<Button href="/entries">{$_('enter_now', { default: 'Enter now' })}</Button>
					<Button variant="ghost">{$_('learn_more', { default: 'Learn more' })}</Button>
				</div>
			</div>
		</div>
	</section>
{/if}
