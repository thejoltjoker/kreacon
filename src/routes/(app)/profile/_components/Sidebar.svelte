<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
</script>

<aside>
	<ul>
		<li>
			<a href="/profile" class:active={$page.url.pathname === '/profile'}>{$t('General')}</a>
			>
		</li>
		<li>
			<a href="/profile/password" class:active={$page.url.pathname === '/profile/password'}
				>{$t('Password')}</a
			>
		</li>
		<li>
			<a href="/profile/tickets" class:active={$page.url.pathname === '/profile/tickets'}
				>{$t('Tickets')}</a
			>
		</li>
	</ul>
</aside>

<style lang="postcss">
	@reference "../../../../app.css";

	aside {
		@apply w-profile-sidebar;
	}

	a {
		@apply rounded-form px-md py-sm text-shade-300 hover:bg-muted-background block hover:text-white;
	}

	ul {
		@apply flex flex-col;
	}

	.active {
		@apply font-bold text-white;
	}
</style>
