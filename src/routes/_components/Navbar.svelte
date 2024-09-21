<script>
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
</script>

<nav>
	<ul class="left">
		<li><Link href="/">Kreacon</Link></li>
	</ul>
	<ul class="right">
		<li><Link href="/">Home</Link></li>
		<li><Link href="/profile">Profile</Link></li>
		<li><Link href="/restricted">Restricted</Link></li>

		<li><a href="/login"><Button>Login</Button></a></li>
		<li><a href="/logout"><Button>Logout</Button></a></li>
	</ul>
</nav>

<style lang="postcss">
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
