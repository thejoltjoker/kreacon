<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import { t } from '$lib/i18n';
	import AccountsSection from './_components/AccountsSection.svelte';
	import GeneralSection from './_components/GeneralSection.svelte';
	import TicketsSection from './_components/TicketsSection.svelte';
	interface PageProps {
		data: import('./$types').PageData;
	}

	let { data }: PageProps = $props();

	let { tickets, accounts } = data;
	// TODO Allow user image upload
</script>

<svelte:head>
	<title>{$t('Profile')}</title>
</svelte:head>

<main class="flex w-full max-w-(--breakpoint-md) flex-col gap-4xl px-sm pt-xl md:px-xl">
	<GeneralSection />
	<Divider />
	<TicketsSection {tickets} form={data.ticketForm} />
	<Divider />
	<AccountsSection {accounts} />
</main>
