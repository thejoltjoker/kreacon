<script lang="ts">
	import { page } from '$app/stores';
	import EventsForm from '../../_components/EventsForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<EventsForm data={data.form} />
