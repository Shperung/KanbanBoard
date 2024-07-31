import {API_PATH} from './apiConst';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type ApiOptions = {
  method: HttpMethod;
  headers: HeadersInit;
  body?: string;
};

export async function api<T>(
  path: string,
  method?: HttpMethod,
  body?: Object
): Promise<T> {
  const url = `${API_PATH}/${path}`;

  const headerMethod = method || 'GET';
  console.log('%c ******* api', 'color:yellow', url, headerMethod);

  const options: ApiOptions = {
    method: headerMethod,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
