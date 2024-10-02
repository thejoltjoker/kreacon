import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { env } from '$env/dynamic/private';
let appInsights: ApplicationInsights | undefined = undefined;

export const getAppInsights = () => {
	if (!env.AZURE_APP_INSIGHTS_CONNECTION_STRING) return;

	if (appInsights) return appInsights;

	appInsights = new ApplicationInsights({
		config: {
			connectionString: env.AZURE_APP_INSIGHTS_CONNECTION_STRING
		}
	});
	appInsights.loadAppInsights();
	appInsights.trackPageView();

	return appInsights;
};