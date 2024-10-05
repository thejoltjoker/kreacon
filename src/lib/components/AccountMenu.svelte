<script lang="ts">
	import { user } from '$lib/stores/userStore';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
	import Avatar from './Avatar.svelte';
	import { _ } from 'svelte-i18n';

	const {
		elements: { trigger, menu, item, separator },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true,
		loop: true
	});
</script>

<!-- Avatar -->
<button type="button" class="trigger" use:melt={$trigger} aria-label="Update dimensions">
	<Avatar src={$user?.image ?? ''} size="md" />
	<span class="sr-only">Open account menu</span>
</button>

{#if $open}
	<div class="menu" use:melt={$menu} transition:fly={{ duration: 150, x: 10 }}>
		<div class="item" use:melt={$item}>
			<a href="/profile">{$_('page.profile')}</a>
		</div>

		<div class="separator" use:melt={$separator} />
		<div class="item" use:melt={$item}>
			<a href="/logout">{$_('page.logout')}</a>
		</div>
	</div>
{/if}

<style lang="postcss">
	.menu {
		@apply w-64 rounded-sm border border-white bg-black p-sm text-white;
	}

	.item {
		@apply rounded-full px-md py-xs hover:bg-white hover:text-black;
	}

	.separator {
		@apply m-xs h-[1px] bg-zinc-200;
	}
</style>
