<script lang="ts">
	import AccountMenu from '$lib/components/AccountMenu.svelte';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import { user } from '$lib/stores/userStore';
	import { AlignJustifyIcon, PlusIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { fly } from 'svelte/transition';

	let isMenuOpen = false;

	const menuItems = [
		{ label: $_('nav.home', { default: 'Home' }), href: '/' },
		{ label: $_('nav.submissions', { default: 'Submissions' }), href: '/submissions' }
	];
</script>

<nav>
	<ul class="left">
		<li><a href="/" id="title">Kreacon</a></li>
		{#each menuItems as item}
			<li><Link href={item.href}>{item.label}</Link></li>
		{/each}
	</ul>
	<div class="md:hidden">
		<Button square on:click={() => (isMenuOpen = !isMenuOpen)} class="z-20">
			<AlignJustifyIcon class="size-5" />
		</Button>
	</div>
	<ul class="right">
		{#if $user}
			<li>
				<div class="hidden md:block">
					<Button href="/submit" size="md">
						{$_('nav.submit', { default: 'Submit' })}
					</Button>
				</div>
				<div class="md:hidden">
					<Button square size="md">
						<PlusIcon class="h-4 w-4" />
					</Button>
				</div>
			</li>
			<li>
				<AccountMenu />
			</li>
		{:else}
			<li><Button href="/login" size="md">{$_('nav.login', { default: 'Login' })}</Button></li>
			<li><Button href="/register" size="md">{$_('nav.register', { default: 'Register' })}</Button></li>
		{/if}
	</ul>
</nav>

{#if isMenuOpen}
	<div class="absolute left-0 top-0 z-10 h-full w-full bg-black" transition:fly={{ y: -100 }}>
		<!-- <div class="p-sm">
			<Button square on:click={() => (isMenuOpen = !isMenuOpen)}>
				<AlignJustifyIcon class="size-5" />
			</Button>
		</div> -->
		<div class="flex h-full items-center justify-center">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<ul class="flex flex-col gap-lg text-2xl" on:click={() => (isMenuOpen = false)}>
				{#each menuItems as item}
					<li
						in:fly={{
							delay: 50,
							y: -20
						}}
					>
						<Link href={item.href}>{item.label}</Link>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}

<style lang="postcss">
	#title {
		@apply text-xl font-bold;
	}
	nav {
		@apply flex items-center gap-sm px-sm py-xs;
	}
	ul {
		@apply inline-flex items-center gap-sm;
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
