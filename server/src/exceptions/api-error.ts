export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);

    this.status = status;
  }

  static BadRequest(message: string) {
    return new ApiError(400, message);
  }

  static Unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static Forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static NotFound(message = 'Not Found') {
    return new ApiError(404, message);
  }

  static Conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }

  static TooManyRequests(message = 'Too Many Requests') {
    return new ApiError(429, message);
  }
}
