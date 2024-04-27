import { ConnectionState, IWebSocketClient, newWebSocketClient } from "./net/ws";
import { NetworkListener } from "./network-listener";
import { IPacket } from "./packet";

export interface RemoteEvent
{
  onConnected: () => void;
  onDisconnected: () => void;
  onConnectionError: (err: string) => void;
}

export interface GameEvent
{
  onError: (errCode: string, errString: string) => void;
  onEnterUser: (userId: number, displayName: string) => void;
  onChatMessage: (senderId: number, sender: string, message: string) => void;
  onRemoveUser: (userId: number) => void;
}

export class Remote implements IPacket
{
  private websocket: IWebSocketClient;
  private remoteEvent: RemoteEvent;

  private gameEvent?: GameEvent;

  public constructor(remoteEvent: RemoteEvent, gameEvent?: GameEvent)
  {
    this.websocket = newWebSocketClient("browser");
    this.websocket.setListener(new NetworkListener(this));
    this.remoteEvent = remoteEvent;
    this.gameEvent = gameEvent;
  }

  public async setGameEvent(gameEvent: GameEvent)
  {
    this.gameEvent = gameEvent;
  }

  public async recvError(errCode: string, errString: string): Promise<void>
  {
    console.log("client: recvError", errCode, errString);

    this.gameEvent?.onError(errCode, errString);
  }

  public async recvEnterUser(userId: number, displayName: string): Promise<void>
  {
    console.log("client: recvEnterUser", userId, displayName);

    this.gameEvent?.onEnterUser(userId, displayName);
  }

  public async recvChat(senderId: number, sender: string, message: string): Promise<void>
  {
    console.log("client: recvChat", senderId, sender, message);

    this.gameEvent?.onChatMessage(senderId, sender, message);
  }

  public async recvRemoveUser(userId: number): Promise<void>
  {
    console.log("client: recvRemoveUser", userId);

    this.gameEvent?.onRemoveUser(userId);
  }

  public onConnected()
  {
    this.remoteEvent.onConnected();
  }

  public onDisconnected()
  {
    this.remoteEvent.onDisconnected();
  }

  public onConnectError(err: string)
  {
    this.remoteEvent.onConnectionError(err);
  }

  public connect(url: string)
  {
    if (!this.connected())
    {
      this.websocket.connect(url);
    }
  }

  public send(data: string)
  {
    if (this.connected())
    {
      this.websocket.send(data);
    }
  }

  public disconnect()
  {
    if (this.connected())
    {
      this.websocket.close();
    }
  }

  public connected(): boolean
  {
    return this.websocket.getState() === ConnectionState.CONNECTED;
  }

  public close()
  {
    this.disconnect();
  }
}

