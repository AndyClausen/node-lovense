export enum ConnectionType {
  PC,
  MOBILE,
  QR,
  SERVER,
}

export enum Platform {
  PC = "pc",
  iOS = "ios",
  Android = "android",
}

export enum AppType {
  Connect = "connect",
  Remote = "remote",
}

export enum Feature {
  Vibrate,
  Rotate,
  Pump,
}

export const ToySupportedFunctions = {
  calor: Feature.Vibrate,
  gush: Feature.Vibrate,
  hyphy: Feature.Vibrate,
  dolce: Feature.Vibrate,
  ambi: Feature.Vibrate,
  max: Feature.Vibrate,
  mission: Feature.Vibrate,
  edge: Feature.Vibrate,
  hush: Feature.Vibrate,
  lush: Feature.Vibrate,
  domi: Feature.Vibrate,
  diamo: Feature.Vibrate,
  osci: Feature.Vibrate,
  ferri: Feature.Vibrate,
  nora: Feature.Vibrate,
  exomoon: Feature.Vibrate,
} as const;

export const LOVENSE_SERVER_BASE_URL =
  "https://api.lovense-api.com/api/lan/" as const;
