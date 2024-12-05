<script lang="ts">
	import Divider from '$lib/components/Divider.svelte';
	import GeneralSection from './_components/GeneralSection.svelte';
	import TicketsSection from './_components/TicketsSection.svelte';
	interface PageProps {
		data: import('./$types').PageData;
	}

	let { data }: PageProps = $props();

	let { tickets, user } = data;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<main class="flex w-full max-w-screen-md flex-col gap-4xl px-sm pt-xl md:px-xl">
	<GeneralSection {user} />
	<Divider />
	<TicketsSection {tickets} form={data.ticketForm} />
	<Divider />
</main>
