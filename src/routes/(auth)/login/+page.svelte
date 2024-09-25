<script lang="ts">
	import type { PageData } from './$types';
	import LoginForm from './_components/LoginForm.svelte';

	export let data: PageData;
</script>

<LoginForm {data} />
