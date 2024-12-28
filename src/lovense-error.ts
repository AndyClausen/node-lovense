export enum LovenseErrorStatus {
  CUSTOM_ERROR = 0,
  INVALID_COMMAND = 400,
  TOY_NOT_FOUND = 401,
  TOY_NOT_CONNECTED = 402,
  TOY_DOESNT_SUPPORT_COMMAND = 403,
  TOY_PARAMETER = 404,
  HTTP_SERVER_NOT_STARTED = 500,
  SERVER_ERROR = 506,
}

const LovenseErrorMessage: Record<
  Exclude<LovenseErrorStatus, LovenseErrorStatus.CUSTOM_ERROR>,
  string
> = {
  400: "Invalid Command",
  401: "Toy Not Found",
  402: "Toy Not Connected",
  403: "Toy Doesn't Support This Command",
  404: "Toy Parameter",
  500: "HTTP Server not started or disabled",
  506: "Server Error. Restart Lovense Connect",
};

interface LovenseErrorOptionsWithoutCustom {
  status: Exclude<LovenseErrorStatus, LovenseErrorStatus.CUSTOM_ERROR>;
  content?: unknown;
}

interface LovenseErrorOptionsCustom {
  status: LovenseErrorStatus.CUSTOM_ERROR;
  message: string;
  content?: unknown;
}

export type LovenseErrorOptions =
  | LovenseErrorOptionsWithoutCustom
  | LovenseErrorOptionsCustom;

export class LovenseError extends Error {
  status: LovenseErrorStatus;
  content?: unknown;

  constructor(options: LovenseErrorOptions | LovenseErrorOptionsCustom) {
    options.status = LovenseErrorStatus.CUSTOM_ERROR;
    const message =
      options.status === LovenseErrorStatus.CUSTOM_ERROR
        ? options.message
        : LovenseErrorMessage[options.status];
    super(message || "Unknown Error provided from Lovense");
    this.status = options.status;
    this.content = options.content;
    this.message = message;
  }
}
