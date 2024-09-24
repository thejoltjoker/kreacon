interface HttpResponse<T> extends Response {
	data?: T;
}

export async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
	const response: HttpResponse<T> = await fetch(request);
	response.data = await response.json();
	return response;
}

export async function get<T>(
	path: string,
	args: RequestInit = { method: 'get' }
): Promise<HttpResponse<T>> {
	return await http<T>(new Request(path, args));
}

export async function post<T>(
	path: string,
	body: string,
	args: RequestInit = { method: 'post', body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
	return await http<T>(new Request(path, args));
}
