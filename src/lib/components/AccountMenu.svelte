<script lang="ts">
	import { user } from '$lib/stores/userStore';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
	import Avatar from './Avatar.svelte';
	import { _ } from 'svelte-i18n';

	const {
		elements: { trigger, menu, item, separator, arrow },
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
	<div class="menu" use:melt={$menu} transition:fly={{ duration: 150, y: -10 }}>
		<div class="flex items-center gap-xs px-sm">
			<Avatar src={$user?.image ?? ''} size="xl" />
			<div class="flex flex-col">
				<p class="text-sm font-bold">{$user?.username}</p>
				<p class="text-sm text-zinc-500">{$user?.email}</p>
			</div>
		</div>
		<div class="separator" use:melt={$separator} />
		<div class="item" use:melt={$item}>
			<a href="/profile">{$_('page.profile')}</a>
		</div>

		<div class="separator" use:melt={$separator} />
		<div class="item" use:melt={$item}>
			<a href="/logout">{$_('page.logout')}</a>
		</div>
		<div use:melt={$arrow} />
	</div>
{/if}

<style lang="postcss">
	.menu {
		@apply w-80 rounded-sm border border-white bg-white p-sm pt-lg text-black;
	}

	.item {
		@apply flex w-full;
		& a {
			@apply w-full rounded-full px-md py-xs transition hover:bg-black hover:text-white;
		}
	}

	.separator {
		@apply m-xs h-[1px] bg-zinc-200;
	}
</style>
