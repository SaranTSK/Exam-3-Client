import { ConnectionState, IWebSocketClient, IWebSocketClientListener } from './ws';

export class WebSocketBrowser implements IWebSocketClient
{
  private websocket: WebSocket|undefined;
  private listener: IWebSocketClientListener|undefined;
  private state: ConnectionState;

  public constructor()
  {
    this.websocket = undefined;
    this.listener = undefined;
    this.state = ConnectionState.DISCONNECTED;
  }

  public setListener(listener: IWebSocketClientListener): void
  {
    this.listener = listener;
  }

  public connect(url: string): void
  {
    this.state = ConnectionState.CONNECTING;
    this.websocket = new WebSocket(url);
    this.websocket.binaryType = "arraybuffer";

    this.websocket.addEventListener('open', async (_event) => {
      this.state = ConnectionState.CONNECTED;
      if (this.listener !== undefined)
      {
        await this.listener.onConnectionEstablished(this);
      }
    });

    this.websocket.addEventListener("message", async (event) => {
      if (this.listener !== undefined)
      {
        await  this.listener.onReceived(this, event.data);
      }
    });

    this.websocket.addEventListener("close", async (event) => {
      this.state = ConnectionState.DISCONNECTED;
      if (this.listener !== undefined)
      {
        await  this.listener.onConnectionLost(this, `${event.code} ${event.reason}`);
      }
    });

    this.websocket.addEventListener("error", async (_event) => {
      this.state = ConnectionState.DISCONNECTED;
      if (this.listener !== undefined)
      {
        await this.listener.onConnectionError(this, "none");
      }
    });

  }

  public send(message: string)
  {
    if (this.websocket === undefined)
    {
      console.log("WebSocketClient: Invalid state (this.websocket === undefined)");
      return;
    }

    if (this.state !== ConnectionState.CONNECTED)
    {
      console.log("WebSocketClient: Invalid state (this.state !== ConnectionState.CONNECTED)");
      return;
    }

    if (this.websocket.readyState !== WebSocket.OPEN)
    {
      console.log("WebSocketClient: Invalid state (this.websocket.readyState !== WebSocket.OPEN)");
      return;
    }

    this.websocket.send(message);
  }

  public shutdown()
  {
    //
  }

  public close()
  {
    if (this.websocket !== undefined)
    {
      this.websocket.close();
    }
  }

  public getState(): ConnectionState
  {
    if (this.websocket !== undefined && this.websocket.readyState !== WebSocket.OPEN)
    {
      this.close();
      this.state = ConnectionState.DISCONNECTED;
    }

    return this.state;
  }
}
