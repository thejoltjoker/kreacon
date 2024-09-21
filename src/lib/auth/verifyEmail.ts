import { AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS, JWT_SIGNATURE } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { Email, type EmailMessage } from '$lib/services/email';
import * as crypto from 'crypto';

export const createVerifyEmailToken = (email: string) => {
	try {
		const authString = `${JWT_SIGNATURE}:${email}`;
		return crypto.createHash('sha256').update(authString).digest('hex');
	} catch (error) {
		console.error(error);
	}
};

export const createVerifyEmailLink = async (email: string) => {
	try {
		const token = createVerifyEmailToken(email);
		const uriEncodedEmail = encodeURIComponent(email);
		const url = `http://${PUBLIC_BASE_URL ?? 'localhost:5173'}/verify-email/${uriEncodedEmail}/${token}`;
		return url;
	} catch (error) {
		console.error(error);
	}
};

export const sendEmailVerification = async (recipient: string) => {
	const verificationLink = await createVerifyEmailLink(recipient);
	const emailMessage: EmailMessage = {
		from: AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS,
		to: recipient,
		subject: 'Verify your email',
		body: `<html>
	<head></head>
	<body
		class="flex items-center justify-center h-screen bg-black text-white"
		style="margin: 0px; line-height: inherit; display: flex; height: 100vh; align-items: center; justify-content: center; --tw-bg-opacity: 1; background-color: rgb(0 0 0 / var(--tw-bg-opacity)); --tw-text-opacity: 1; color: rgb(255 255 255 / var(--tw-text-opacity));">
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Verify your email</title>

		<main
			class="border border-white rounded-3xl p-8 flex flex-col gap-4"
			style="display: flex; flex-direction: column; gap: 1rem; border-radius: 1.5rem; border-width: 1px; --tw-border-opacity: 1; border-color: rgb(255 255 255 / var(--tw-border-opacity)); padding: 2rem;">
			<h1 class="text-2xl font-bold" style="font-size: 1.5rem; font-weight: 700; margin: 0px; line-height: 2rem;">
				Verify your email
			</h1>
			<p class="opacity-75" style="margin: 0px; opacity: 0.75;">Click the button below to verify your email</p>
			<a
				href="${verificationLink}"
				class="bg-rose-500 text-white rounded-full p-4 text-center font-bold"
				style="color: rgb(255 255 255 / var(--tw-text-opacity)); text-decoration: inherit; border-radius: 9999px; --tw-bg-opacity: 1; background-color: rgb(244 63 94 / var(--tw-bg-opacity)); padding: 1rem; text-align: center; font-weight: 700; --tw-text-opacity: 1;">
				Click here to verify your email
			</a>
		</main>
	</body>
</html>
`
	};
	const email = new Email('azure', emailMessage);
	await email.send();
};
