<script lang="ts">
	import { deserialize, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { t } from '$lib/i18n';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from '../$types';
	import ReactionsList from '../../../_components/ReactionsList.svelte';
	import type { ReactionListItem } from '../../../_components/ReactionsListItem.svelte';

	let {
		reactions
	}: {
		reactions?: NonNullable<PageData['entry']>['reactions'];
	} = $props();

	let reactionListItems: ReactionListItem[] = $derived(
		reactions?.map((reaction) => ({
			url: `/users/${reaction.user.username}/reactions`,
			image: { src: reaction.user.avatar?.url ?? '', alt: `${reaction.user.username} avatar` },
			value: reaction.value
		})) ?? []
	);
	let formRef = $state<HTMLFormElement | null>(null);
	let reactionValue = $state('');
	const handleAddReaction = async (emoji: string) => {
		reactionValue = emoji;

		// Trigger the form submission programmatically
		if (formRef) {
			formRef.requestSubmit();
		}
	};
	const handleSubmit: SubmitFunction = async ({ formData, action }) => {
		formData.set('reaction', reactionValue);
		const response = await fetch(action, {
			method: 'POST',
			body: formData,
			headers: {
				'x-sveltekit-action': 'true'
			}
		});

		const result = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
		}
	};
</script>

<section id="entry-reactions" class="flex flex-col gap-sm">
	<h4>{$t('Reactions')}</h4>
	<ReactionsList reactions={reactionListItems} onAddReaction={handleAddReaction} />
</section>
<form
	method="POST"
	bind:this={formRef}
	hidden
	class="hidden"
	action="?/react"
	use:enhance={handleSubmit}
></form>
