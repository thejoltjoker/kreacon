<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { user } from '$lib/stores/userStore';
	user.set(data.user);
</script>

<h1>Profile</h1>
