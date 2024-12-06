import { error } from '@sveltejs/kit';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const isAdmin = (locals: App.Locals) =>
	locals.user != null && locals.session != null && locals.user.role === 'admin';

export const adminCheck = (locals: App.Locals) => {
	if (!isAdmin(locals)) {
		throw error(StatusCodes.UNAUTHORIZED, getReasonPhrase(StatusCodes.UNAUTHORIZED));
	}
};
