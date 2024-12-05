<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { CheckCircle2Icon, PlusIcon } from 'lucide-svelte';
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
		<h3>General</h3>
	</div>
	<form action="?/updateProfile" class="flex flex-col gap-xl">
		<!-- TODO Allow updating email and username -->
		<DumbInput disabled label="Email" bind:value={user.email} />
		<DumbInput disabled label="Username" bind:value={user.username} />
		<!-- <div class="flex justify-end">
			<Button type="submit">Save</Button>
		</div> -->
	</form>
</div>
