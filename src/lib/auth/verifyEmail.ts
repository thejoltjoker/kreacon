import { JWT_SIGNATURE, ROOT_DOMAIN } from '$env/static/private';
import * as crypto from 'crypto';
export const createVerifyEmailToken = async (email: string) => {
	try {
		const authString = `${JWT_SIGNATURE}:${email}`;
		return crypto.createHash('sha256').update(authString).digest('hex');
	} catch (error) {
		console.error(error);
	}
};

export const createVerifyEmailLink = async (email: string) => {
	try {
		const token = await createVerifyEmailToken(email);
		const uriEncodedEmail = encodeURIComponent(email);
		const url = `http://${ROOT_DOMAIN}/verify-email/${uriEncodedEmail}/${token}`;
		return url;
	} catch (error) {
		console.error(error);
	}
};
