import { AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS } from '$env/static/private';
import { Email, type EmailMessage } from '$lib/server/services/email';
import crypto from 'crypto';
import template from '../../../assets/verify-email-template.html?raw';
import env from '$lib/env';

export const TOKEN_VALIDITY_MS = 24 * 60 * 60 * 1000;

export const createVerifyEmailToken = (email: string, timestamp?: number) => {
	const ts = timestamp ?? Date.now();
	const authString = `${env.EMAIL_VERIFICATION_SECRET}:${email}:${ts}`;
	const token = crypto.createHash('sha256').update(authString).digest('hex');
	return { token, timestamp: ts };
};

export const createVerifyEmailLink = (email: string): string => {
	const { token, timestamp } = createVerifyEmailToken(email);
	const uriEncodedEmail = encodeURIComponent(email);
	const protocol = env.NODE_ENV === 'production' ? 'https' : 'http';
	const baseUrl = env.PUBLIC_BASE_URL || 'localhost:5173';
	const url = `${protocol}://${baseUrl}/verify-email/${uriEncodedEmail}/${token}?t=${timestamp}`;
	return url;
};

export const sendEmailVerification = async (recipient: string) => {
	const verificationLink = createVerifyEmailLink(recipient);
	const emailMessage: EmailMessage = {
		from: AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS,
		to: recipient,
		subject: 'Verify your email',
		body: template.replace('{{VERIFICATION_LINK}}', verificationLink)
	};
	const email = new Email(emailMessage);
	await email.send();
};
