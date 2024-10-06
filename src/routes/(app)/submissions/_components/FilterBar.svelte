<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Select from '$lib/components/Select/Select.svelte';

	import { _ } from 'svelte-i18n';
</script>

<div class="flex items-center gap-sm">
	<Button>{$_('entity.submission.filter.all')}</Button>
	<Select
		label="Filter"
		options={[
			{
				label: 'All',
				value: 'all'
			},
			{
				label: 'My Submissions',
				value: 'my-submissions'
			}
		]}
	/>
</div>
