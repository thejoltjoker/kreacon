<script lang="ts">
	import type { PageData } from '../$types';
	import Button from '$lib/components/Button.svelte';
	type Submission = PageData['submission'];
	export let submission: Submission;
</script>

<div class="flex gap-sm">
	<Button>Share</Button>
	<Button variant="rose">Vote</Button>
</div>
