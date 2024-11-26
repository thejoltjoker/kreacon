<script lang="ts">
	import AccountMenu from '$lib/components/AccountMenu.svelte';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import type { UserWithoutPassword } from '$lib/server/db/schema/user';
	import { user } from '$lib/stores/user';

	// Use store for user

	import { AlignJustifyIcon, PlusIcon, XIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { fly } from 'svelte/transition';

	let isMenuOpen = $state(false);

	const menuItems = [
		{ label: $_('submissions', { default: 'Submissions' }), href: '/submissions' },
		{ label: $_('events', { default: 'Events' }), href: '/' }
	];
</script>

<nav>
	<ul class="left">
		<li><a href="/" id="title">Kreacon</a></li>
		{#each menuItems as item}
			<li>
				<Button href={item.href} variant="ghost">
					{item.label}
				</Button>
			</li>
		{/each}
	</ul>
	<div class="md:hidden">
		<Button
			onclick={() => (isMenuOpen = !isMenuOpen)}
			class="relative z-40"
			variant="outline"
			size="icon"
		>
			{#if isMenuOpen}
				<XIcon />
			{:else}
				<AlignJustifyIcon />
			{/if}
		</Button>
	</div>
	<ul class="right gap-sm">
		{#if $user}
			<li>
				<div class="hidden md:block">
					<Button variant="outline" href="/submit">
						{$_('submit', { default: 'Submit' })}
					</Button>
				</div>
				<div class="md:hidden">
					<Button size="icon" variant="outline" href="/submit">
						<PlusIcon class="h-4 w-4" />
					</Button>
				</div>
			</li>
			<li>
				<AccountMenu />
			</li>
		{:else}
			<li>
				<Button href="/register" variant="outline">{$_('sign_up', { default: 'Sign up' })}</Button>
			</li>
			<li>
				<Button variant="white" href="/login">{$_('login', { default: 'Login' })}</Button>
			</li>
		{/if}
	</ul>
</nav>

<!-- Mobile menu -->
{#if isMenuOpen}
	<div class="absolute left-0 top-0 z-10 h-full w-full bg-black" transition:fly={{ y: -100 }}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="flex h-full items-center justify-center">
			<ul class="flex flex-col gap-lg text-2xl">
				{#each menuItems as item}
					<li
						in:fly={{
							delay: 50,
							y: -20
						}}
					>
						<Link href={item.href} onclick={() => (isMenuOpen = false)}>{item.label}</Link>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}

<style lang="postcss">
	#title {
		@apply mr-2xl text-xl font-bold;
	}
	nav {
		@apply flex items-center gap-sm px-sm py-sm md:px-lg;
	}
	ul {
		@apply inline-flex items-center;
		&.left {
			@apply hidden md:inline-flex;
		}
		& li {
			@apply flex items-center;
		}
		&.right {
			@apply ml-auto;
		}
	}
</style>
