import {
	AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS,
	AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING
} from '$env/static/private';
import {
	EmailClient as AzureEmailClient,
	type EmailMessage as AzureEmailMessage
} from '@azure/communication-email';
import { z } from 'zod';

export const emailClient = new AzureEmailClient(AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING);

export type EmailServices = 'azure';

export type EmailMessage = {
	from: string;
	to: string;
	subject: string;
	body: string;
};

export class Email {
	private _from: string = '';
	private _to: string = '';
	private _subject: string = '';
	private _body: string = '';
	public service: EmailServices;

	constructor(service?: EmailServices, message?: EmailMessage) {
		this.service = service ?? 'azure';
		if (message) {
			this._from = message.from;
			this._to = message.to;
			this._subject = message.subject;
			this._body = message.body;
		}
	}

	fromObject(email: { from: string; to: string; subject: string; body: string }) {
		this._from = email.from;
		this._to = email.to;
		this._subject = email.subject;
		this._body = email.body;
	}

	static validateAddress(address: string) {
		try {
			z.string().email().parse(address);
			return true;
		} catch (err) {
			console.warn(err);
			return false;
		}
	}

	set from(address: string) {
		if (Email.validateAddress(address)) {
			this._from = address;
		}
	}

	get from(): string {
		return this._from;
	}

	set to(address: string) {
		if (Email.validateAddress(address)) {
			this._to = address;
		}
	}

	get to(): string {
		return this._to;
	}

	set subject(subject: string) {
		this._subject = subject;
	}

	get subject(): string {
		return this._subject;
	}

	set body(body: string) {
		this._body = body;
	}

	get body(): string {
		return this._body;
	}

	async _sendAzure() {
		const emailMessage: AzureEmailMessage = {
			senderAddress: AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS,
			content: {
				subject: this.subject,
				html: this.body
			},
			recipients: {
				to: [{ address: this.to }]
			}
		};

		const poller = await emailClient.beginSend(emailMessage);
		const result = await poller.pollUntilDone();

		return result;
	}

	async send() {
		switch (this.service) {
			case 'azure':
				return this._sendAzure();
			default:
				throw new Error('Invalid email service');
		}
	}
}
