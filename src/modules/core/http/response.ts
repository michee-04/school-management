export enum StatusCode {
  SUCCESS = 10000,
  FAILURE = 10001,
  RETRY = 10002,
  INVALID_ACCESS_TOKEN = 10003,
}

export class HttpMessageResponse {
  readonly statusCode: StatusCode;
  readonly message: string;

  constructor(statusCode: StatusCode, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class HttpDataResponse<T> extends HttpMessageResponse {
  readonly data: T;

  constructor(statusCode: StatusCode, message: string, data: T) {
    super(statusCode, message);
    this.data = data;
  }
}

export class HttpErrorResponse<T> extends HttpMessageResponse {
  readonly data: T;

  constructor(statusCode: StatusCode, message: string, data: T) {
    super(statusCode, message);
    this.data = data;
  }
}
