import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export const isAuthenticated = (locals: App.Locals) =>
	locals.user != null && locals.session != null;

export const authCheck = (locals: App.Locals, redirectUrl: string = '/') => {
	if (!isAuthenticated(locals)) {
		throw redirect(StatusCodes.MOVED_TEMPORARILY, redirectUrl);
	}
};
