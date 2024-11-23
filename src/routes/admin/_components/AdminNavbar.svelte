<script>
	import Button from '$lib/components/OldButton.svelte';
	import Link from '$lib/components/Link.svelte';
	import { _ } from 'svelte-i18n';
</script>

<nav>
	<ul class="left">
		<li><a href="/" id="title">{$_('home', { default: 'Kreacon' })}</a></li>
	</ul>
	<ul class="right">
		<li><Link href="/">{$_('home', { default: 'Home' })}</Link></li>
		<li><Link href="/profile">{$_('profile', { default: 'Profile' })}</Link></li>
		<li><Link href="/restricted">{$_('restricted', { default: 'Restricted' })}</Link></li>
		<li><Link href="/db/seed">{$_('seed', { default: 'Seed' })}</Link></li>
		<li><a href="/login"><Button>{$_('login', { default: 'Login' })}</Button></a></li>
		<li>
			<a href="/logout">
				<Button>{$_('logout', { default: 'Logout' })}</Button>
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
