<script lang="ts">
	import type { PageData } from './$types';
	import { userProvider } from '$lib/providers/userProvider.svelte';

	const user = userProvider.user;

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	userProvider.user = data.user;
</script>

<div>
	<h1>OAuth Callback</h1>
</div>
