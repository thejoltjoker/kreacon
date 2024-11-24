<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { _ } from 'svelte-i18n';

	let { isSignedIn, id }: { isSignedIn: boolean; id: string } = $props();
	console.log('isSignedIn', isSignedIn);
</script>

{#if isSignedIn}
	<Button>{$_('vote', { default: 'Vote' })}</Button>
{:else}
	<Button href="/login?redirect=/submissions/{id}">{$_('vote', { default: 'Vote' })}</Button>
{/if}
