import { IWebSocketClient, IWebSocketClientListener } from "./net/ws";
import { dispatchPacket } from "./packet";
import { Remote } from "./remote";

export class NetworkListener implements IWebSocketClientListener
{
  private remote: Remote;
  public constructor(remote: Remote)
  {
    this.remote = remote;
  }

  public async onConnectionEstablished(_wsc: IWebSocketClient)
  {
    this.remote.onConnected();
  }

  public async onReceived(wsc: IWebSocketClient, message: string)
  {
    if (!await dispatchPacket(this.remote, message))
    {
      console.log(`Packet not found ${message}`);
    }
  }

  public async onConnectionLost(_wsc: IWebSocketClient)
  {
    this.remote.onDisconnected();
  }

  public async onConnectionError(wsc: IWebSocketClient, err: string)
  {
    this.remote.onConnectError(err);
  }
}

export interface NetworkOptions
{
  ws_url: string;
}
