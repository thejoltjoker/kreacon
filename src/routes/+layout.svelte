<script>
	import '../app.css';
	import Navbar from './_components/Navbar.svelte';

	import { ApplicationInsights } from '@microsoft/applicationinsights-web';

	if (process.env.AZURE_APP_INSIGHTS_CONNECTION_STRING) {
		const appInsights = new ApplicationInsights({
			config: {
				connectionString: process.env.AZURE_APP_INSIGHTS_CONNECTION_STRING
			}
		});
		appInsights.loadAppInsights();
		appInsights.trackPageView();
	}
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<Navbar />
<main>
	<slot />
</main>

<style lang="postcss">
	main {
		@apply px-sm py-xs;
	}
</style>
