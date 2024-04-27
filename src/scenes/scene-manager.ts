import { ChatScene, UserData } from "./chat-scene";
import { LoginScene } from "./login-scene";

export class SceneManager
{
  private game: Phaser.Game;

  private chatScene?: ChatScene;

  public constructor(game: Phaser.Game)
  {
    this.game = game;
  }

  public async doLoginScene()
  {
    if (this.chatScene !== undefined)
    {
      this.game.scene.remove(this.chatScene.getName());
    }

    return new Promise<string>((resolve, _reject) => {
      const login = new LoginScene((user) => {
        this.game.scene.remove(login.getName());
        resolve(user);
      });

      this.game.scene.add(login.getName(), login);
      this.game.scene.start(login.getName());
    })
  }

  public async createChatScene(displayName: string, onChatEnter?: (message: string) => void)
  {
    this.chatScene = new ChatScene(displayName, onChatEnter);

    this.game.scene.add(this.chatScene.getName(), this.chatScene);
    this.game.scene.start(this.chatScene.getName());

    return this.chatScene;
  }

  public async addChat(senderId: number, sender: string, chat: string)
  {
    this.chatScene?.chat(senderId, sender, chat);
  }

  public async addUser(userId: number, displayName: string)
  {
    this.chatScene?.addUser(userId, displayName);
  }

  public async removeUser(userId: number)
  {
    this.chatScene?.removeUser(userId);
  }
}