export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;

export type PaginationData = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
