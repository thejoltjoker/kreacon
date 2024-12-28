<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import { t } from '$lib/i18n';
	import type { PageData } from '../$types';
	type Entry = PageData['entry'];
	export let entry: Entry;
</script>

<section id="entry-details">
	<h1>{entry?.title}</h1>
	<p class="text-muted-foreground">
		{$t('Submitted to')}
		<a href="/categories/{entry?.category?.id}" class="font-bold text-amber-500"
			>{entry?.category?.name}</a
		>
	</p>
	<div class="author">
		<Avatar src={entry?.user?.picture ?? ''} username={entry?.user?.username ?? 'Unknown'} />
		<p class="w-full font-bold">{entry?.user?.username}</p>
		<a href={`/users/${entry?.user?.username}`}>
			<Button>{$t('Profile')}</Button>
		</a>
	</div>
</section>

<style lang="postcss">
	h1 {
		@apply text-2xl font-bold;
	}
	.author {
		@apply mt-sm flex items-center gap-xs;
	}
</style>
