<script lang="ts">
	import AccountMenu from '$lib/components/AccountMenu.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import { user } from '$lib/stores/userStore';
	import { PlusIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
</script>

<nav>
	<!-- <ul class="left">
		<li><a href="/" id="title">Kreacon</a></li>
		<li><Link href="/submissions">{$_('nav.submissions', { default: 'Submissions' })}</Link></li>
		<li><Link href="/categories">{$_('nav.categories', { default: 'Categories' })}</Link></li>
		<li><Link href="/rules">{$_('nav.rules', { default: 'Rules' })}</Link></li>
	</ul> -->
	<ul class="right">
		{#if $user}
			<li>
				<Button square>
					<span class="hidden md:block">
						{$_('nav.submit', { default: 'Submit' })}
					</span>
					<span class="md:hidden">
						<PlusIcon class="h-4 w-4" />
					</span>
				</Button>
			</li>
			<li>
				<a href="/profile">
					<Avatar image={$user.image ?? ''} size="sm" />
				</a>
			</li>
		{:else}
			<li><Button href="/login">{$_('nav.login', { default: 'Login' })}</Button></li>
		{/if}
		<li>
			<AccountMenu />
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
