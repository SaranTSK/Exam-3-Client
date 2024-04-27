/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PacketMapper { [key: string]: (remote: IPacket, data: any) => Promise<void>; }

export async function dispatchPacket(remote: IPacket, message: string): Promise<boolean>
{
  const packet = JSON.parse(message);
  if (packet === undefined) return false;
  if (packet.name === undefined) return false;

  const func = MAPPER[packet.name];
  if (func !== undefined)
  {
    await func(remote, packet.data);
    return true;
  }

  return false;
}

export interface IPacket
{
  onConnected(): void;
  onDisconnected(): void;
  connect(url: string): void;
  disconnect(): void;
  connected(): boolean;
  send(data: string): void;

  // client to server
  recvError(errCode: string, errString: string): Promise<void>;
  recvChat(senderId: number, sender: string, message: string): Promise<void>;
  recvEnterUser(userId: number, displayName: string): Promise<void>;
  recvRemoveUser(userId: number): Promise<void>;
}

const MAPPER: PacketMapper = {
  Error: dispatchError,
  Chat: dispatchChat,
  EnterUser: dispatchEnterUser,
  RemoveUser: dispatchRemoveUser
};

async function dispatchError(remote: IPacket, data: any)
{
  await remote.recvError(data.errCode, data.errString);
}
async function dispatchChat(remote: IPacket, data: any)
{
  await remote.recvChat(data.senderId, data.sender, data.message);
}
async function dispatchEnterUser(remote: IPacket, data: any)
{
  await remote.recvEnterUser(data.userId, data.displayName);
}
async function dispatchRemoveUser(remote: IPacket, data: any)
{
  await remote.recvRemoveUser(data.userId);
}

  // server to client
export function sendLogin(remote: IPacket|undefined, displayName: string)
{
  if (remote === undefined || !remote.connected()) return;

  remote.send(JSON.stringify({ name: "Login", data: { displayName } }));
  console.log("client: sendLogin", { displayName });
}
export function sendChat(remote: IPacket|undefined, message: string)
{
  if (remote === undefined || !remote.connected()) return;

  remote.send(JSON.stringify({ name: "Chat", data: { message } }));
  console.log("client: sendChat", { message });
}

export function sendPrivateChat(remote: IPacket|undefined, receiverId: number, message: string)
{
  if (remote === undefined || !remote.connected()) return;

  remote.send(JSON.stringify({ name: "PrivateChat", data: { receiverId, message } }));
  console.log("client: sendPrivateChat", { receiverId, message });
}
