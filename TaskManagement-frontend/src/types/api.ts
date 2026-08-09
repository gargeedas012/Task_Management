export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  result: T;
  errors: ApiError[];
}

