# node-lovense

NodeJS Implementation of the Lovense REST API [Local &amp; Server]

**Note: This is a work in progress and is not yet complete.**

A more complete, official implementation using Socket API is available from Lovense, but it does not support REST API and does not have types.

Contributions are welcome and appreciated.

## Installation

```bash
npm install node-lovense
```

## Usage

Create a Lovense instance:

```ts
import { Lovense, ConnectionType } from "node-lovense";

const lovense = new Lovense({
  connectionType: ConnectionType.SERVER,
  token: process.env.LOVENSE_TOKEN, // Lovense developer token
  uid: process.env.LOVENSE_UID, // User ID on your application
});

await lovense.getQRCode();
```

After receiving a callback from scanning the QR Code, you can set the data on the Lovense instance:

```ts
lovense.setConnectCallbackData(qrData);
```

You should then be able to get a list of toys with this:

```ts
lovense.getToys();
```

Executing actions is done by passing in an options object, and actions for the rest of the parameters:

```ts
// one action on all toys
lovense.executeActions(
  { duration: 5 },
  { action: ActionType.Thrusting, strength: 20 }
);

// multiple actions on a single toy, running indefinitely
lovense.executeActions(
  { toy: toyId },
  { action: ActionType.Thrusting, strength: 20 },
  { action: ActionType.Vibrate, strength: 20 },
  { action: ActionType.Rotate, strength: 20 }
);
```
