<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import { user } from '$lib/stores/userStore';
	import { _ } from 'svelte-i18n';
</script>

<nav>
	<ul class="left">
		<li><a href="/" id="title">Kreacon</a></li>
		<li><Link href="/submissions">{$_('nav.submissions', { default: 'Submissions' })}</Link></li>
		<li><Link href="/categories">{$_('nav.categories', { default: 'Categories' })}</Link></li>
		<li><Link href="/rules">{$_('nav.rules', { default: 'Rules' })}</Link></li>
	</ul>
	<ul class="right">
		{#if $user}
			<li>
				<a href="/submissions/create">
					<Button>{$_('nav.submit', { default: 'Submit' })}</Button>
				</a>
			</li>
			<li>
				<a href="/profile" class="">
					<Avatar imageUrl={$user.image ?? ''} size="sm" />
				</a>
			</li>
		{:else}
			<li><a href="/login"><Button>{$_('nav.login', { default: 'Login' })}</Button></a></li>
		{/if}
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
