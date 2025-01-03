import { LovenseError } from "./lovense-error.js";
import {
  LovenseResponse,
  LovenseQRResponse,
  CommandOptions,
  LovenseToy,
  VibrateParams,
  ThrustingParams,
} from "./types.js";
import {
  ConnectionType,
  LOVENSE_SERVER_BASE_URL,
  Platform,
} from "./constants.js";

interface LovenseOptions {
  /** The type of connection we are using.*/
  connectionType: ConnectionType;
  /** Lovense developer token */
  token?: string;
  /** User ID on your application */
  uid?: string;
  /** Username on your application */
  uname?: string;
}

export class Lovense {
  /** Method in which we are connecting to Lovense Servers */
  connectionType: ConnectionType;

  /** Connection Port needed for Local API access */
  localConnectPort: number = 30010;

  /** Local Domain */
  localDomain: string = "";

  /** What platform is the connection running on? */
  platform: string = "";

  /** Cache of the Lovense Toys. Information in here may not be correct and shouldn't be used. */
  private _toysCache: LovenseToy[] = [];

  private _token?: string;
  private _uid?: string;
  private _uname?: string;

  constructor(options: LovenseOptions) {
    this.connectionType = options.connectionType;
    if (options.connectionType === ConnectionType.SERVER) {
      this._token = options.token;
      this._uid = options.uid;
      this._uname = options.uname;
    }
  }

  /**
   * Get the QR Code for the Lovense Server
   * You need to provide a callback URL on the developer dashboard to be used for the QR Code
   * @returns {Promise<{code: number, message: string, result: true, data: {qr: string, code: string}}>}
   */
  async getQRCode(): Promise<{
    code: number;
    message: string;
    result: true;
    data: { qr: string; code: string };
  }> {
    const response = await fetch(
      new URL("getQrCode", LOVENSE_SERVER_BASE_URL),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: this._token,
          uid: this._uid,
          uname: this._uname,
          v: 2,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new LovenseError({
        content: data,
        status: data.code,
        message: data.message,
      });
    }

    return data;
  }

  /**
   * Get's all of the Lovense Toys from LAN or cache.
   * This will return the cached data if your connection type is not LAN.
   * @returns {LovenseToy[]} Returns an array of Lovense Toys.
   */
  async fetchToys(): Promise<LovenseToy[]> {
    if (this.connectionType === ConnectionType.SERVER) {
      return this._toysCache;
    }
    const response = await this._executeCommand({
      command: "GetToys",
    });

    let toys: LovenseToy[];
    if ((response.result ?? response.type === "OK") && response.data) {
      toys =
        typeof response.data.toys === "string"
          ? Object.values(JSON.parse(response.data.toys))
          : response.data.toys;
    } else {
      throw new LovenseError({
        content: response,
        status: response.code,
        message: response.message,
      });
    }

    this._toysCache = toys;
    return toys;
  }

  /**
   * This should only be used with a remote connection.
   * @param toys
   */
  setToys(toys: LovenseToy[]): void {
    this._toysCache = toys;
  }

  /**
   * Get all data of the Lovense toys from the cache.
   * @returns {LovenseToy[]} Returns local cache of Lovense Toys
   */
  getToys(): LovenseToy[] {
    return this._toysCache;
  }

  /**
   * Get all ONLINE Lovense Toys from the cache
   * @returns {LovenseToy[]} Returns an array of Lovense Toys
   */
  getOnlineToys(): LovenseToy[] {
    return this._toysCache.filter((toy) => toy.status);
  }

  async vibrate({
    strength,
    toy,
    duration,
  }: VibrateParams): Promise<LovenseResponse> {
    duration = duration ?? 0;

    if (strength > 20) {
      strength = 20;
    }
    if (strength < 0) {
      strength = 0;
    }

    return await this._executeCommand({
      command: "Function",
      toy: (typeof toy === "string" ? toy : toy?.id) ?? undefined,
      action: "Vibrate:" + strength,
      timeSec: duration,
      apiVer: 1,
    });
  }

  async thrusting({
    speed,
    toy,
    duration,
  }: ThrustingParams): Promise<LovenseResponse> {
    duration = duration ?? 0;

    if (speed > 20) {
      speed = 20;
    }
    if (speed < 0) {
      speed = 0;
    }

    return await this._executeCommand({
      command: "Function",
      toy: (typeof toy === "string" ? toy : toy?.id) ?? undefined,
      action: "Thrusting:" + speed,
      timeSec: duration,
      apiVer: 1,
    });
  }

  setConnectCallbackData(response: LovenseQRResponse) {
    this.localDomain = response.domain;
    this.localConnectPort = response.httpsPort;

    if (response.toys) {
      this._toysCache = Object.values(response.toys);
    }
  }

  /**
   * Execute a RAW command.
   * @param command The command to be sent to the Lovense Toy.
   * @returns
   */
  private async _executeCommand(
    command: CommandOptions
  ): Promise<LovenseResponse> {
    let body: string;

    switch (this.connectionType) {
      case ConnectionType.LOCAL:
        body = JSON.stringify({
          ...command,
        });
      case ConnectionType.SERVER:
        body = JSON.stringify({
          ...command,
          token: this._token,
          uid: this._uid,
        });
    }
    let res: Response;
    console.log(this._generateCommandUrl());
    try {
      res = await fetch(this._generateCommandUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
    } catch (error: unknown) {
      // Convert to LovenseError
      throw new LovenseError({
        content: error,
        status: 0,
        message: "Error while connecting to Lovense Server",
      });
    }
    const json: LovenseResponse = await res.json();
    if (json.result === false || (json.type && json.type !== "OK")) {
      throw new LovenseError({
        content: json,
        status: res.status,
        message: json.message,
      });
    }
    return json;
  }

  /**
   * Generate the correct URL Scheme for sending commands to the Lovense Server or local API
   */
  private _generateCommandUrl(): URL {
    let baseUrl: URL;
    switch (this.connectionType) {
      case ConnectionType.LOCAL:
        if (this.platform === Platform.PC) {
          baseUrl = new URL(
            `https://127-0-0-1.lovense.club:${this.localConnectPort}`
          );
          break;
        }
        baseUrl = new URL(
          `https://${this.localDomain}:${this.localConnectPort}`
        );
        break;
      case ConnectionType.SERVER:
        baseUrl = new URL("v2/", LOVENSE_SERVER_BASE_URL);
    }
    return new URL("command/", baseUrl);
  }

  /**
   * Convert the Object into URL encoded Parameters
   * @param params Object of parameters to be sent to the Server
   * @returns {string} string of URL encoded parameters
   */
  private _formatParams(params: CommandOptions): string {
    var retArr: string[] = [];
    for (const entry in Object.entries(params)) {
      retArr.push(
        encodeURIComponent(entry[0]) + "=" + encodeURIComponent(entry[1])
      );
    }
    return retArr.join("&");
  }
}
