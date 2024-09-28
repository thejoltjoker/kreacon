<script lang="ts">
	import AdminNavbar from './_components/AdminNavbar.svelte';
	import SidebarMenu from './_components/SidebarMenu.svelte';
	import type { LayoutData } from './[entity]/$types';

	export let data: LayoutData;
</script>

<AdminNavbar />
<div class="flex gap-sm px-sm md:gap-md md:px-md">
	<aside class="hidden flex-col lg:flex">
		<SidebarMenu />
		<p>{'Event name'}</p>
		<ul>
			<li>
				<a href="/admin/events/1/categories">Categories</a>
			</li>
			<li>
				<a href="/admin/events/1/submissions">Submissions</a>
			</li>
		</ul>
	</aside>

	<div class="w-full">
		<slot />
	</div>
</div>

<style lang="postcss">
	aside {
		@apply w-sidebar border border-red-500;
		& ul {
			@apply flex flex-col gap-y-2;
		}
	}
</style>
