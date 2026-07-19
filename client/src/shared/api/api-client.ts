import axios from 'axios';
import type { AxiosResponse } from 'axios';

import { BASE_API_URL } from './api-constants';
import type { ApiResponse } from './api-types';

type QueryParamsValue = string | number | boolean | null | undefined;

type ApiClientParams = URLSearchParams | Record<string, QueryParamsValue>;

type ApiClientGetOptions = {
  path: string;
  params?: ApiClientParams;
  signal?: AbortSignal;
  errorMessage?: string;
  skipAuthRefresh?: boolean;
};

type ApiClientPostOptions<Body> = {
  path: string;
  body?: Body;
  signal?: AbortSignal;
  errorMessage?: string;
  skipAuthRefresh?: boolean;
};

type ApiClientPatchOptions<Body> = {
  path: string;
  body?: Body;
  signal?: AbortSignal;
  errorMessage?: string;
  skipAuthRefresh?: boolean;
};

type ApiClientDeleteOptions = {
  path: string;
  signal?: AbortSignal;
  errorMessage?: string;
  skipAuthRefresh?: boolean;
};

type ApiAuthRefreshHandler = () => Promise<boolean>;

let apiAuthRefreshHandler: ApiAuthRefreshHandler | null = null;
let apiAuthRefreshPromise: Promise<boolean> | null = null;

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

export const apiInstance = axios.create({
  baseURL: BASE_API_URL,
  validateStatus: () => true,
  withCredentials: true,
});

export const setApiAccessToken = (accessToken: string | null) => {
  if (accessToken) {
    apiInstance.defaults.headers.common.Authorization =
      `Bearer ${accessToken}`;
    return;
  }

  delete apiInstance.defaults.headers.common.Authorization;
};

export const setApiAuthRefreshHandler = (
  handler: ApiAuthRefreshHandler | null,
) => {
  apiAuthRefreshHandler = handler;
};

const normalizeApiResponse = <Data>(
  responseStatus: number,
  responseData: ApiResponse<Data>,
  errorMessage: string,
): ApiResponse<Data> => {
  if (responseStatus >= 400 && responseData.success) {
    return {
      success: false,
      message: errorMessage,
    };
  }

  return responseData;
};

const refreshApiAuthSession = async () => {
  if (!apiAuthRefreshHandler) return false;

  apiAuthRefreshPromise ??= apiAuthRefreshHandler().finally(() => {
    apiAuthRefreshPromise = null;
  });

  return apiAuthRefreshPromise;
};

const requestWithAuthRefresh = async <Data>(
  request: () => Promise<AxiosResponse<ApiResponse<Data>>>,
  errorMessage: string,
  skipAuthRefresh = false,
): Promise<ApiResponse<Data>> => {
  const response = await request();

  if (response.status !== 401 || skipAuthRefresh) {
    return normalizeApiResponse(response.status, response.data, errorMessage);
  }

  const isAuthRefreshed = await refreshApiAuthSession();

  if (!isAuthRefreshed) {
    return normalizeApiResponse(response.status, response.data, errorMessage);
  }

  const retryResponse = await request();

  return normalizeApiResponse(
    retryResponse.status,
    retryResponse.data,
    errorMessage,
  );
};

export const apiClient = {
  get: async <Data>({
    path,
    params,
    signal,
    errorMessage = 'Request failed',
    skipAuthRefresh,
  }: ApiClientGetOptions): Promise<ApiResponse<Data>> => {
    return requestWithAuthRefresh(
      () =>
        apiInstance.get<ApiResponse<Data>>(
          `${path}${buildQueryString(params)}`,
          { signal },
        ),
      errorMessage,
      skipAuthRefresh,
    );
  },
  post: async <Data, Body = unknown>({
    path,
    body,
    signal,
    errorMessage = 'Request failed',
    skipAuthRefresh,
  }: ApiClientPostOptions<Body>): Promise<ApiResponse<Data>> => {
    return requestWithAuthRefresh(
      () =>
        apiInstance.post<ApiResponse<Data>>(path, body, {
          signal,
        }),
      errorMessage,
      skipAuthRefresh,
    );
  },
  patch: async <Data, Body = unknown>({
    path,
    body,
    signal,
    errorMessage = 'Request failed',
    skipAuthRefresh,
  }: ApiClientPatchOptions<Body>): Promise<ApiResponse<Data>> => {
    return requestWithAuthRefresh(
      () =>
        apiInstance.patch<ApiResponse<Data>>(path, body, {
          signal,
        }),
      errorMessage,
      skipAuthRefresh,
    );
  },
  delete: async <Data>({
    path,
    signal,
    errorMessage = 'Request failed',
    skipAuthRefresh,
  }: ApiClientDeleteOptions): Promise<ApiResponse<Data>> => {
    return requestWithAuthRefresh(
      () =>
        apiInstance.delete<ApiResponse<Data>>(path, {
          signal,
        }),
      errorMessage,
      skipAuthRefresh,
    );
  },
};
