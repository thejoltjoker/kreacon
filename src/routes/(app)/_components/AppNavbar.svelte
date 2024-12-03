<script lang="ts">
	import { page } from '$app/stores';
	import AccountMenu from '$lib/components/AccountMenu.svelte';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import { t } from '$lib/i18n';
	import { AlignJustifyIcon, PlusIcon, XIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { fly } from 'svelte/transition';
	const user = $derived($page.data.user);
	let isMenuOpen = $state(false);
	let { title }: { title: { text: string; href: string } } = $props();

	const menuItems = [
		{ label: 'Submissions', href: '/submissions' },
		{ label: 'Events', href: '/events' },
		{ label: 'About', href: '/about' }
	];
</script>

<nav>
	<!-- <BackButton /> -->
	<a class="hidden flex-1 md:block" href={title.href ?? '/'}>
		<h1>{$t(title.text ?? 'Kreacon')}</h1>
	</a>
	<!-- TODO Breadcrumbs -->
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
	<ul class="hidden flex-1 justify-center gap-sm md:flex">
		{#each menuItems as item}
			<li>
				<Button variant="ghost" href={item.href} onclick={() => (isMenuOpen = false)}
					>{item.label}</Button
				>
			</li>
		{/each}
	</ul>
	<ul class="flex flex-1 items-center justify-end gap-sm">
		{#if user}
			<li>
				<div class="hidden md:block">
					<Button variant="default" href="/submissions/create">
						{$_('submit', { default: 'Submit' })}
					</Button>
				</div>
				<div class="md:hidden">
					<Button size="icon" variant="default" href="/submissions/create">
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
	nav {
		@apply flex items-center justify-between gap-sm border-b border-b-divider px-sm py-sm md:px-xl;
	}
</style>
