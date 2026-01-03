import { error } from '@sveltejs/kit';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const isAdmin = (locals: App.Locals) =>
	locals.user != null &&
	locals.session != null &&
	(locals.user.role === 'admin' || locals.user.role === 'superadmin');

export const adminCheck = (locals: App.Locals) => {
	if (locals.user == null || locals.session == null) {
		throw error(StatusCodes.UNAUTHORIZED, getReasonPhrase(StatusCodes.UNAUTHORIZED));
	}
	if (locals.user.role !== 'admin' && locals.user.role !== 'superadmin') {
		throw error(StatusCodes.FORBIDDEN, getReasonPhrase(StatusCodes.FORBIDDEN));
	}
};
