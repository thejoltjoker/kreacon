<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { PageData } from '../$types';
	type Submission = PageData['submission'];
	export let submission: Submission;
</script>

<section id="submission-details">
	<h1>{submission?.title}</h1>
	<p class="text-zinc-500">
		Submitted to
		<a href="/categories/{submission?.category?.id}" class="font-bold text-amber-500"
			>{submission?.category?.name}</a
		>
	</p>
	<div class="author">
		<Avatar src={`/${submission?.user?.image}`} size="sm" />
		<p class="w-full font-bold">{submission?.user?.username}</p>
		<a href={`/users/${submission?.user?.username}`}>
			<Button>Profile</Button>
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
