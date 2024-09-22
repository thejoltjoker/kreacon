import { ApplicationInsights } from '@microsoft/applicationinsights-web';

export const getAppInsights = () => {
	if (!process.env.AZURE_APP_INSIGHTS_CONNECTION_STRING) {
		return;
	}
	const appInsights = new ApplicationInsights({
		config: {
			connectionString: process.env.AZURE_APP_INSIGHTS_CONNECTION_STRING
		}
	});
	appInsights.loadAppInsights();
	appInsights.trackPageView();
	return appInsights;
};
