import axios from 'axios';

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

type ApiClientPostOptions<Body> = {
  path: string;
  body?: Body;
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

export const apiClient = {
  get: async <Data>({
    path,
    params,
    signal,
    errorMessage = 'Request failed',
  }: ApiClientGetOptions): Promise<ApiResponse<Data>> => {
    const response = await apiInstance.get<ApiResponse<Data>>(
      `${path}${buildQueryString(params)}`,
      { signal },
    );

    return normalizeApiResponse(response.status, response.data, errorMessage);
  },
  post: async <Data, Body = unknown>({
    path,
    body,
    signal,
    errorMessage = 'Request failed',
  }: ApiClientPostOptions<Body>): Promise<ApiResponse<Data>> => {
    const response = await apiInstance.post<ApiResponse<Data>>(path, body, {
      signal,
    });

    return normalizeApiResponse(response.status, response.data, errorMessage);
  },
};
