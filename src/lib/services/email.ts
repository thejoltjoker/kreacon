import {
	AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS,
	AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING
} from '$env/static/private';
import { EmailClient } from '@azure/communication-email';

export const emailClient = new EmailClient(AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING);

export const sendEmail = async (to: string, subject: string, body: string) => {
	console.log('[sendEmail]', to, subject, body);
	const emailMessage = {
		senderAddress: AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS,
		content: {
			subject,
			plainText: body
		},
		recipients: {
			to: [{ address: to }]
		}
	};

	const poller = await emailClient.beginSend(emailMessage);
	const result = await poller.pollUntilDone();
	console.log(result);

	return result;
};
