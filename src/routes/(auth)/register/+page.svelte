<script lang="ts">
	import TextInput from '$lib/components/InputField.svelte';
	import type { PageData } from './$types';
	import LoginForm from './components/RegisterForm.svelte';

	export let data: PageData;
</script>

<LoginForm />
