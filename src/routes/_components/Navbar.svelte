<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
</script>

<nav>
	<ul class="left">
		<li><a href="/" id="title">Kreacon</a></li>
	</ul>
	<ul class="right">
		<li><Link href="/">Home</Link></li>
		<li><Link href="/profile">Profile</Link></li>
		<li><Link href="/restricted">Restricted</Link></li>

		<li><a href="/login"><Button>Login</Button></a></li>
		<li>
			<form action="/logout" use:enhance method="POST">
				<Button type="submit">Logout</Button>
			</form>
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
