<script lang="ts">
	import type { PageData } from '../$types';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	let {
		user
	}: {
		user: PageData['user'];
	} = $props();
</script>

<div class="flex w-full flex-col gap-sm">
	<div class="flex items-center justify-between">
		<h2>General</h2>
	</div>
	<form action="?/updateProfile" class="flex flex-col gap-xl">
		<!-- TODO Allow updating email and username -->
		<DumbInput variant="ghost" disabled label="Email" bind:value={user.email} />
		<DumbInput variant="ghost" disabled label="Username" bind:value={user.username} />
		<!-- <div class="flex justify-end">
			<Button type="submit">Save</Button>
		</div> -->
	</form>
</div>
