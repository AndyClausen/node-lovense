/**
 * These error codes are returned by the Lovense Server
 */
export enum LovenseErrorStatus {
  CUSTOM_ERROR = 0,
  INVALID_COMMAND = 400,
  TOY_NOT_FOUND = 401,
  TOY_NOT_CONNECTED = 402,
  TOY_DOESNT_SUPPORT_COMMAND = 403,
  INVALID_PARAMETER = 404,
  HTTP_SERVER_NOT_STARTED = 500,
  INVALID_TOKEN = 501,
  PERMISSION_DENIED = 502,
  INVALID_USER_ID = 503,
  SERVER_ERROR = 506,
  LOVENSE_APP_OFFLINE = 507,
}

interface LovenseErrorOptions {
  status: LovenseErrorStatus.CUSTOM_ERROR;
  message?: string;
  content?: unknown;
}
export class LovenseError extends Error {
  status: LovenseErrorStatus;
  content?: unknown;

  constructor(options: LovenseErrorOptions) {
    super(options.message ?? "Unknown error from Lovense");
    this.status = options.status;
    this.content = options.content;
  }
}
