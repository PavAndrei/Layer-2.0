import { BASE_API_URL } from './api-constants';
import type { ApiResponse } from './api-types';

type QueryParamsValue = string | number | boolean | null | undefined;

type ApiClientParams = URLSearchParams | Record<string, QueryParamsValue>;

type ApiClientGetOptions = {
  path: string;
  params?: ApiClientParams;
  signal?: AbortSignal;
  errorMessage?: string;
};

const buildQueryString = (params?: ApiClientParams) => {
  if (!params) return '';

  if (params instanceof URLSearchParams) {
    const queryString = params.toString();

    return queryString ? `?${queryString}` : '';
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : '';
};

const buildUrl = (path: string, params?: ApiClientParams) => {
  return `${BASE_API_URL}${path}${buildQueryString(params)}`;
};

export const apiClient = {
  get: async <Data>({
    path,
    params,
    signal,
    errorMessage = 'Request failed',
  }: ApiClientGetOptions): Promise<ApiResponse<Data>> => {
    const response = await fetch(buildUrl(path, params), { signal });
    const result = (await response.json()) as ApiResponse<Data>;

    if (!response.ok && result.success) {
      return {
        success: false,
        message: errorMessage,
      };
    }

    return result;
  },
};
