<script>
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import { _ } from 'svelte-i18n';
</script>

<nav>
	<ul class="left">
		<li><a href="/" id="title">Kreacon</a></li>
	</ul>
	<ul class="right">
		<li><Link href="/">{$_('page.home.nav', { default: 'Home' })}</Link></li>
		<li><Link href="/profile">{$_('page.profile.nav', { default: 'Profile' })}</Link></li>
		<li><Link href="/restricted">{$_('page.restricted.nav', { default: 'Restricted' })}</Link></li>
		<li><Link href="/admin">{$_('page.admin.nav', { default: 'Admin' })}</Link></li>
		<li><Link href="/db/seed">Seed</Link></li>

		<li><a href="/login"><Button>{$_('page.login.nav', { default: 'Login' })}</Button></a></li>
		<li>
			<a href="/logout">
				<Button>{$_('page.logout.nav', { default: 'Logout' })}</Button>
			</a>
		</li>
	</ul>
</nav>

<style lang="postcss">
	#title {
		@apply text-xl font-bold;
	}
	nav {
		@apply flex items-center gap-sm px-sm py-xs;
	}
	ul {
		@apply inline-flex items-center gap-sm;
		&.right {
			@apply ml-auto;
		}
	}
</style>
