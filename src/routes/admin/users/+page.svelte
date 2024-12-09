<script lang="ts">
	import { t } from '$lib/i18n';
	import { Tooltip } from 'bits-ui';
	import startCase from 'lodash/startCase';
	import FilterBar from '../_components/EventFilterBar.svelte';
	import type { PageData } from './$types';
	import EntityList from '../_components/EntityList.svelte';
	import { BanIcon, HammerIcon, TicketIcon } from 'lucide-svelte';

	export let data: PageData;
</script>

<FilterBar />
<EntityList
	items={data.users.map((user) => ({
		...user,
		thumbnailUrl: user.picture ?? '',
		tickets: user.tickets.length,
		submissions: user.submissions.length
	}))}
	fields={['username', 'email', 'role', 'tickets', 'submissions']}
	actions={[
		{ label: 'Show tickets', icon: TicketIcon, onClick: (value) => console.log(value) },
		{
			label: 'Ban user',
			icon: BanIcon,
			onClick: (value) => console.log(value),
			class: 'text-destructive'
		}
	]}
/>
