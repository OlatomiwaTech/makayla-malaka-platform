const API_URL =
	process.env.NEXT_PUBLIC_API_URL ??
	'http://localhost:5000/api';

type ApiError = {
	message: string;
	status: number;
};

let accessToken: string | null = null;
const accessTokenStorageKey = 'makayla_access_token';

export const authTokenStore = {
	get: () => {
		if (typeof window === 'undefined') {
			return accessToken;
		}

		return window.sessionStorage.getItem(accessTokenStorageKey) ?? accessToken;
	},

	set: (token: string | null) => {
		accessToken = token;

		if (typeof window !== 'undefined') {
			if (token) {
				window.sessionStorage.setItem(accessTokenStorageKey, token);
			} else {
				window.sessionStorage.removeItem(accessTokenStorageKey);
			}
		}
	},
};

export const api = async <T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> => {
	const token = authTokenStore.get();

	const headers = new Headers(options.headers);

	headers.set('Content-Type', 'application/json');

	if (token) {
		headers.set(
			'Authorization',
			`Bearer ${token}`,
		);
	}

	const response = await fetch(
		`${API_URL}${endpoint}`,
		{
			...options,
			headers,
			credentials: 'include',
		},
	);

	if (!response.ok) {
		let message = 'Something went wrong';

		try {
			const data = await response.json();
			message = data.message ?? message;
		} catch {
			// Ignore invalid error responses.
		}

		const error: ApiError = {
			message,
			status: response.status,
		};

		throw error;
	}

	return response.json() as Promise<T>;
};
