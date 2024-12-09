<script lang="ts">
	import { t } from '$lib/i18n';
	import { Tooltip } from 'bits-ui';
	import startCase from 'lodash/startCase';
	import FilterBar from '../_components/EventFilterBar.svelte';
	import type { PageData } from './$types';
	import EntityList from '../_components/EntityList.svelte';
	import {
		CircleAlertIcon,
		CircleCheckIcon,
		CircleDashedIcon,
		CircleDotIcon,
		CircleXIcon,
		EditIcon,
		TrashIcon
	} from 'lucide-svelte';

	export let data: PageData;
</script>

<FilterBar />
<EntityList
	items={data.submissions.flatMap((submission) => ({
		...submission,
		username: submission.user.username,
		thumbnailUrl: submission.thumbnail.url,
		category: submission.category.name
	}))}
	fields={['id', 'username', 'category', 'status']}
	actions={[
		{
			label: 'Approve',
			icon: CircleDotIcon,
			onClick: (value) => console.log(value),
			class: '[&_svg]:text-primary'
		},
		{
			label: 'Deny',
			icon: CircleAlertIcon,
			onClick: (value) => console.log(value),
			class: '[&_svg]:text-tertiary'
		},
		{
			label: 'Delete',
			icon: TrashIcon,
			onClick: (value) => console.log(value),
			class: 'text-destructive'
		}
	]}
/>
