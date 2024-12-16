<script lang="ts">
	import EventsForm from '../_components/EventsForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<EventsForm data={data.form} action="/admin/events/create" />
