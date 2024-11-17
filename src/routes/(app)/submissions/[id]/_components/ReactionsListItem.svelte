<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import type { PageData } from '../$types';
	type Reaction = NonNullable<PageData['submission']>['reactions'][number];
	export let reaction: Reaction;

	function getRelativeTime(date: Date): string {
		const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
		const now = new Date();
		const diffInSeconds = (date.getTime() - now.getTime()) / 1000;

		const intervals = [
			{ unit: 'year', seconds: 31536000 },
			{ unit: 'month', seconds: 2592000 },
			{ unit: 'day', seconds: 86400 },
			{ unit: 'hour', seconds: 3600 },
			{ unit: 'minute', seconds: 60 },
			{ unit: 'second', seconds: 1 }
		] as const;

		for (const { unit, seconds } of intervals) {
			const value = Math.round(diffInSeconds / seconds);
			if (Math.abs(value) >= 1) {
				return rtf.format(value, unit);
			}
		}

		return rtf.format(0, 'second');
	}
</script>

<li class="flex items-center gap-2">
	<div>
		<Avatar src={`/${reaction.user?.image}`} />
	</div>
	<div class="flex w-full flex-col">
		<p class="text-sm font-bold">{reaction.user?.username}</p>
		<p class="text-sm text-zinc-500">{getRelativeTime(reaction.createdAt)}</p>
	</div>
	<div class="w-button text-center">
		<p class="text-3xl">{reaction.value}</p>
	</div>
</li>
