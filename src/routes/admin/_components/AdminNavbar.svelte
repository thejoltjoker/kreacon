<script>
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import { _ } from 'svelte-i18n';
</script>

<nav>
	<ul class="left">
		<li><a href="/" id="title">{$_('nav.home', { default: 'Kreacon' })}</a></li>
	</ul>
	<ul class="right">
		<li><Link href="/">{$_('nav.home', { default: 'Home' })}</Link></li>
		<li><Link href="/profile">{$_('nav.profile', { default: 'Profile' })}</Link></li>
		<li><Link href="/restricted">{$_('nav.restricted', { default: 'Restricted' })}</Link></li>
		<li><Link href="/db/seed">{$_('nav.seed', { default: 'Seed' })}</Link></li>
		<li><a href="/login"><Button>{$_('button.login', { default: 'Login' })}</Button></a></li>
		<li>
			<a href="/logout">
				<Button>{$_('button.logout', { default: 'Logout' })}</Button>
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
