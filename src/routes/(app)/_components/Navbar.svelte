<script lang="ts">
	import { page } from '$app/stores';
	import AccountMenu from '$lib/components/AccountMenu.svelte';
	import Button from '$lib/components/Button.svelte';
	import HorizontalMenu from '$lib/components/HorizontalMenu.svelte';
	import HorizontalMenuItem from '$lib/components/HorizontalMenuItem.svelte';
	import Link from '$lib/components/Link.svelte';
	import { t } from '$lib/i18n';
	import { AlignJustifyIcon, HomeIcon, PlusIcon, XIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { fly } from 'svelte/transition';
	const user = $derived($page.data.user);
	let isMenuOpen = $state(false);
	let isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
	let { title }: { title?: { text: string; href: string } } = $props();

	let menuItems = $derived(
		isAdminRoute && user != null
			? [
					{ label: 'Categories', href: '/admin/categories' },
					{ label: 'Events', href: '/admin/events' },
					{ label: 'Submissions', href: '/admin/submissions' },
					{ label: 'Users', href: '/admin/users' },
					{ label: 'Tickets', href: '/admin/tickets' }
				]
			: [
					{ label: 'Home', href: '/' },
					{ label: 'Submissions', href: '/submissions' },
					{ label: 'Events', href: '/events' }
				]
	);
</script>

<nav>
	<!-- <BackButton /> -->
	<div class="hidden flex-1 md:flex">
		<a href={title?.href ?? '/'} class="group">
			<h1>{$t(title?.text ?? 'Kreacon')}</h1>
			<p
				class:hidden={!isAdminRoute}
				class="text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary"
			>
				{$t('Kreacon Admin')}
			</p>
		</a>
	</div>
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
	<HorizontalMenu highlightActive={false} class="max-md:hidden">
		{#each menuItems as item}
			<HorizontalMenuItem href={item.href}>{$t(item.label)}</HorizontalMenuItem>
		{/each}
	</HorizontalMenu>

	<!-- User menu -->
	<ul class="flex flex-1 items-center justify-end gap-sm">
		{#if user && isAdminRoute}
			<li>
				<div class="hidden md:block">
					<Button variant="outline" href="/">
						{$t('App')}
					</Button>
				</div>
				<div class="md:hidden">
					<Button size="icon" variant="outline" href="/">
						<HomeIcon />
					</Button>
				</div>
			</li>
			<li>
				<AccountMenu />
			</li>
		{:else if user}
			<li>
				<div class="hidden md:block">
					<Button variant="default" href="/submissions/create">
						{$t('Submit')}
					</Button>
				</div>
				<div class="md:hidden">
					<Button size="icon" variant="default" href="/submissions/create">
						<PlusIcon />
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
	<div class="absolute left-0 top-0 z-10 h-full w-full bg-bg" transition:fly={{ y: -100 }}>
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
