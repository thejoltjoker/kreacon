import { AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS, JWT_SIGNATURE } from '$env/static/private';
import { Email, EmailBase, type EmailMessage } from '$lib/server/services/email';
import crypto from 'crypto';
import template from '../../assets/verify-email-template.html?raw';

export const createVerifyEmailToken = (email: string) => {
	const authString = `${JWT_SIGNATURE}:${email}`;
	return crypto.createHash('sha256').update(authString).digest('hex');
};

export const createVerifyEmailLink = (email: string): string => {
	const token = createVerifyEmailToken(email);
	const uriEncodedEmail = encodeURIComponent(email);
	const url = `http://${process.env.PUBLIC_BASE_URL ?? 'localhost:5173'}/verify-email/${uriEncodedEmail}/${token}`;
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
