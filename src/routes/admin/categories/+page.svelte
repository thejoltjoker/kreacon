<script lang="ts">
	import { t } from '$lib/i18n';
	import { Tooltip } from 'bits-ui';
	import startCase from 'lodash/startCase';
	import FilterBar from '../_components/EventFilterBar.svelte';
	import type { PageData } from './$types';
	import EntityList from '../_components/EntityList.svelte';

	export let data: PageData;
</script>

<FilterBar />
<EntityList items={data.categories} fields={['id', 'name', 'description', 'slug', 'mediaType']} />
