<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { page } from '$app/stores';
</script>

<aside>
	<ul>
		<li>
			<a href="/profile" class:active={$page.url.pathname === '/profile'}
				>{$_('general', { default: 'General' })}</a
			>
		</li>
		<li>
			<a href="/profile/password" class:active={$page.url.pathname === '/profile/password'}
				>{$_('password', { default: 'Password' })}</a
			>
		</li>
		<li>
			<a href="/profile/tickets" class:active={$page.url.pathname === '/profile/tickets'}
				>{$_('tickets', { default: 'Tickets' })}</a
			>
		</li>
	</ul>
</aside>

<style lang="postcss">
	aside {
		@apply w-profile-sidebar;
	}

	a {
		@apply block rounded-form px-md py-sm text-muted-foreground hover:bg-muted-background hover:text-white;
	}

	ul {
		@apply flex flex-col;
	}

	.active {
		@apply font-bold text-white;
	}
</style>
