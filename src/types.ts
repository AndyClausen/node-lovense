import { AppType, Feature, Platform } from "./constants.js";

export interface LovenseToy {
  nickname: string;
  name: string;
  id: string;
  status: number;
  features: Feature;
}

/**
 * Response when sending a command to the Lovense Server
 */
export interface LovenseResponse {
  result: boolean;
  code: number;
  message?: string;
  data?: LovenseResponseData;
  type: string;
}

/**
 * Response data when sending a command to the Lovense Server
 */
export interface LovenseResponseData {
  /**
   * List of Toys that are available to the user as json
   */
  toys: string;

  /**
   * Platform the connection is running on
   */
  platform: Platform;

  /**
   * The application the connection is running on (Remote or Connect)
   */
  appType: AppType;

  mId?: string;
  mToken?: string;
}

/**
 * Structure of the Command to be sent to the Lovense Server
 */
export interface CommandOptions {
  /**
   * Type of request
   */
  command: string;

  /**
   * Control the function and strength of the toy
   * Actions can be Vibrate, Rotate, Pump or Stop. Use Stop to stop the toy’s response.
   * Range:
   * - Vibrate: 0 ~ 20
   * - Rotate: 0 ~ 20
   * - Pump: 0 ~ 3
   *
   * @example "Vibrate:2;Rotate:4;Pump:7"
   */
  action?: string;

  /**
   * Apply a specific parameters to Pattern
   * - V:1; Protocol version, this is static;
   * - F:vrp; Features: v is vibrate, r is rotate, p is pump, this should match the strength below;
   * - S:1000; Intervals in Milliseconds, should be greater than 100.
   * @example "V:1;F:vrp;S:1000#"
   */
  rule?: string;

  /**
   * The pattern to be applied to the toy
   * @example "20;20;5;20;10"
   */
  strength?: string;

  /**
   * Additionally information to provide with the command.
   */
  name?: string;

  /**
   * Total running time
   * 0 = indefinite length
   * Otherwise, running time should be greater than 1.
   */
  timeSec?: number;

  /**
   * Running time
   * Should be greater than 1.
   */
  loopRunningSec?: number;

  /**
   * Suspend time
   * Should be greater than 1.
   */
  loopPauseSec?: number;

  /**
   * Toy ID
   * If you don't include this, it will be applied to all toys.
   */
  toy?: string;

  /**
   * Stop all previous commands and execute current command.
   */
  stopPrevious?: number;

  /**
   * The version of the request
   */
  apiVer?: number;
}

/**
 * Response when scanning a lovense QR Code
 */
export interface LovenseQRResponse {
  /**
   * The User ID for this Response
   */
  uid: string;

  /**
   * The token to use for Authentication
   */
  utoken: string;

  /**
   * The domain to use for calling Lovense Locally
   */
  domain: string;

  /**
   * Http (Unsecure) Port to use for calling Lovense Locally
   * This is not recommended over using the `httpsPort` instead as secure connections are always better.
   */
  httpPort: number;

  /**
   * Websocket Port to use for calling Lovense Locally
   * This is not recommended over using the `wssPort` instead as secure connections are always better.
   */
  wsPort: number;

  /**
   * Https (Secure) Port to use for calling Lovense Locally
   */
  httpsPort: number;

  /**
   * Websocket (Secure) Port to use for calling Lovense Locally
   */
  wssPort: number;

  /**
   * Platform the connection is running on
   */
  platform: Platform;

  /**
   * App version of the connection
   */
  appVersion: string;

  /**
   * Protocol version
   */
  version: number;

  /**
   * List of toys that are available to the user, indexed by toy ID
   */
  toys: Record<string, LovenseToy>;
}
