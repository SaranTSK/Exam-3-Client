import { NetworkListener } from '../network-listener';
import { WebSocketBrowser } from './ws-client-browser';
import { WebSocketClient } from './ws-client-node';

export interface IWebSocketClientListener
{
  onConnectionError(wsc: IWebSocketClient, err: string): Promise<void>;
  onConnectionEstablished(wsc: IWebSocketClient): Promise<void>;
  onReceived(wsc: IWebSocketClient, message: string): Promise<void>;
  onConnectionLost(wsc: IWebSocketClient, err: string): Promise<void>;
}

export enum ConnectionState
{
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
}

export enum ConnectEvent
{
  ERROR,
  ESTABLISHED,
}

export interface IWebSocketClient
{
  setListener(listener: NetworkListener): void;
  connect(url: string): void;
  send(message: string): void;
  shutdown(): void;
  close(): void;
  getState(): ConnectionState;
}

export function newWebSocketBrowserClient()
{
  return new WebSocketBrowser();
}

export function newWebSocketNodeClient()
{
  return new WebSocketClient();
}

export function newWebSocketClient(_version: string)
{
  return new WebSocketBrowser();
}
