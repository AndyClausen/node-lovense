import { LovenseError } from "./lovense-error.js";
import {
  LovenseResponse,
  LovenseQRResponse,
  CommandOptions,
  LovenseToy,
} from "./types.js";
import { ConnectionType } from "./constants.js";

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
  _toysCache: LovenseToy[] = [];

  /**
   * Get the Connection Type
   * @param connectionType The type of connection we are using. (Do not provide if you would like for PC & Mobile to be Tested automatically by default)
   */
  constructor(connectionType?: ConnectionType) {
    if (connectionType === undefined) {
      // TODO
      // Test PC connection
      // Test Mobile Connection
      // Error
      throw new Error("Not Implemented");
    } else {
      this.connectionType = connectionType;
    }
    switch (connectionType) {
      case ConnectionType.PC:
        // Test PC connection
        break;
      case ConnectionType.MOBILE:
        // Test Mobile Connection
        break;
    }
  }
  /**
   * Get's all of the Lovense Toys from Lovense Servers
   * @returns {LovenseToy[]} Returns an array of Lovense Toys.
   */
  async fetchToys(): Promise<LovenseToy[]> {
    return new Promise<LovenseToy[]>(async (resolve, reject) => {
      var response = await this.executeCommand({
        command: "GetToys",
      });

      var toys: LovenseToy[] = [];
      if (response.data && response.data.toys) {
        if (typeof response.data.toys === "string") {
          toys = JSON.parse(response.data.toys);
        }
      } else if (response.data && typeof response.data === "object") {
        toys = <LovenseToy[]>response.data.toys;
        this._toysCache = toys;
      } else {
        reject(
          new LovenseError({
            content: response,
            status: 0,
            message: "No Toys Found",
          })
        );
      }

      this._toysCache = toys;
      resolve(toys);
    });
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

  async vibrate(
    toy: string | LovenseToy,
    strength: number,
    duration?: number
  ): Promise<LovenseResponse> {
    duration = duration || 0;

    if (strength > 20) {
      strength = 20;
    }
    if (strength < 0) {
      strength = 0;
    }

    return await this.executeCommand({
      command: "Vibrate",
      toy: typeof toy === "string" ? toy : toy.id,
      action: "Vibrate:" + strength,
      timeSec: duration,
    });
  }

  setConnectCallbackData(response: LovenseQRResponse) {
    this.localDomain = response.domain;
    this.localConnectPort = response.httpsPort;

    if (response.toys) {
      this._toysCache = response.toys;
    }
  }

  /**
   * Execute a RAW command.
   * @param command The command to be sent to the Lovense Toy.
   * @returns
   */
  async executeCommand(command: CommandOptions): Promise<LovenseResponse> {
    switch (this.connectionType) {
      case ConnectionType.PC:
      case ConnectionType.MOBILE:
        let res: Response;
        try {
          res = await fetch(this._generateLovenseUrl(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(command),
          });
        } catch (error: unknown) {
          // if (err.errno === "400") {}
          // Convert to LovenseError
          throw new LovenseError({
            content: error,
            status: 0,
            message: "Error while connecting to Lovense Server",
          });
        }
        const json = await res.json();
        if (res.status !== 200) {
          throw new LovenseError({
            content: json,
            status: res.status,
          });
        }
        return json;

      case ConnectionType.QR:
      case ConnectionType.SERVER:
        throw new Error("Not Implemented");
    }
  }

  private _testConnection() {}

  /**
   * Generate the Correct URL Scheme for Local VS QR
   */
  private _generateLovenseUrl(): string {
    switch (this.connectionType) {
      case ConnectionType.PC:
        return `https://127-0-0-1.lovense.club:${this.localConnectPort}/command`;
      case ConnectionType.MOBILE:
        return `https://${this.localDomain}.lovense.club:${this.localConnectPort}/command`;
      case ConnectionType.QR:
      case ConnectionType.SERVER:
        throw new Error("Not Implemented");
    }
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
