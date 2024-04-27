import { alertDialog, getQueryString } from "./helper";
import { sendChat, sendLogin, sendPrivateChat } from "./packet";
import { Remote } from "./remote";
import { SceneManager } from "./scenes/scene-manager";

export class Client
{
  private static instance?: Client;
  public static newClient(phaserConfig: Phaser.Types.Core.GameConfig, env: EnvironmentEndpoint)
  {
    if (Client.instance === undefined)
    {
      Client.instance = new Client(phaserConfig, env);
    }
    return Client.instance;
  }

  private envEndpoint: EnvironmentEndpoint;

  private remote?: Remote;

  private game: Phaser.Game;
  private sceneManager: SceneManager;

  private constructor(phaserConfig: Phaser.Types.Core.GameConfig, env: EnvironmentEndpoint)
  {
    this.envEndpoint = env;

    this.game = new Phaser.Game(phaserConfig);
    this.sceneManager = new SceneManager(this.game);

    this.activeLogin().catch((e) => console.error(e));
  }

  private async activeLogin()
  {
    const displayName = await this.sceneManager.doLoginScene();

    const remoteEvent = {
      onConnected: async () => { await this.onConnected(displayName); },
      onDisconnected: async () => { await this.onDisconnected(); },
      onConnectionError: async (err: string) => { await this.onConnectionError(err); },
    }
    this.remote = new Remote(remoteEvent);
    this.remote.connect(this.getEnvironmentEndpoint());
  }

  public getRemote()
  {
    return this.remote;
  }

  public close()
  {
    //
  }

  private async onConnected(displayName: string)
  {
    if (this.remote)
    {
      this.remote.setGameEvent({
        onError: async (errCode: string, errString: string) => { alertDialog(`${errCode}: ${errString}`); },
        onEnterUser: async (userId: number, displayName: string) => {  await this.sceneManager.addUser(userId, displayName); },
        onChatMessage: async (userId: number, displayName: string, message: string) => { await this.sceneManager.addChat(userId, displayName, message); },
        onRemoveUser: async (userId: number) => { await this.sceneManager.removeUser(userId); },
      });

      await this.sceneManager.createChatScene(displayName, (message) => {
        sendChat(this.remote, message);
      });

      sendLogin(this.remote, displayName);
    }
  }

  private async onDisconnected()
  {
    alertDialog("onDisconnected")
    await this.activeLogin();
  }

  private async onConnectionError(err: string)
  {
    alertDialog(`onConnectionError: ${err}`)
    await this.activeLogin();
  }

  private getEnvironmentEndpoint()
  {
    const env = getQueryString("env");
    if (env === undefined) return this.envEndpoint.dev;
    return this.envEndpoint[env] || this.envEndpoint.dev;
  }
}

export interface EnvironmentEndpoint
{
  dev: string;
  prod: string;
}
