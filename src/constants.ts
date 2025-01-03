export enum ConnectionType {
  LOCAL,
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

export enum ActionType {
  Vibrate = "Vibrate",
  Rotate = "Rotate",
  Pump = "Pump",
  Thrusting = "Thrusting",
  Fingering = "Fingering",
  Suction = "Suction",
  Depth = "Depth",
  All = "All",
  Stop = "Stop",
}

export const ToySupportedFunctions = {
  calor: ActionType.Vibrate,
  gush: ActionType.Vibrate,
  hyphy: ActionType.Vibrate,
  dolce: ActionType.Vibrate,
  ambi: ActionType.Vibrate,
  max: ActionType.Vibrate,
  mission: ActionType.Vibrate,
  edge: ActionType.Vibrate,
  hush: ActionType.Vibrate,
  lush: ActionType.Vibrate,
  domi: ActionType.Vibrate,
  diamo: ActionType.Vibrate,
  osci: ActionType.Vibrate,
  ferri: ActionType.Vibrate,
  nora: ActionType.Vibrate,
  exomoon: ActionType.Vibrate,
} as const;

export const LOVENSE_SERVER_BASE_URL =
  "https://api.lovense-api.com/api/lan/" as const;
