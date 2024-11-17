<script lang="ts">
	import { LockIcon } from 'lucide-svelte';
	import type { PageData } from './$types';
	import Button from '$lib/components/Button.svelte';
	export let data: PageData;
</script>

<div class="wrapper">
	<div class="container">
		This route is restricted to signed in users

		<section class="protected">
			{#if data.user}
				{JSON.stringify(data.user, null, 2)}
			{:else}
				<LockIcon /> Hidden content
			{/if}
		</section>
		{#if data.user}
			<a href="/logout"><Button>Log out</Button></a>
		{:else}
			<a href="/login"><Button>Log in</Button></a>
		{/if}
	</div>
</div>

<style lang="postcss">
	.wrapper {
		@apply flex h-screen items-center justify-center;
	}
	.container {
		@apply flex max-w-screen-sm flex-col gap-sm;
	}
	.protected {
		@apply flex items-center justify-center gap-xs rounded-md border border-neutral-400 p-sm;
	}
	a:hover {
		@apply bg-transparent;
	}
</style>
