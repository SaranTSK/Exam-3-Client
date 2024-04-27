import { SCREEN_HEIGHT, SCREEN_WIDTH } from "~/main";

const NAME = "LoginScene";

export class LoginScene extends Phaser.Scene
{
  private onLoginClicked?: (user: string) => void;

  public constructor(onLoginClicked?: (user: string) => void)
  {
    super(NAME);

    this.onLoginClicked = onLoginClicked;
  }

  public getName() { return NAME; }

  protected preload()
  {
    this.load.image("logo-debuz.png", "assets/logo-debuz.png");
  }

  protected create()
  {
    this.add.rectangle(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 50, SCREEN_WIDTH * 0.8, SCREEN_HEIGHT * 0.8, 0x3C3C3C);
    this.add.sprite(SCREEN_WIDTH / 2, 200, "logo-debuz.png").setDisplaySize(600, 162);
    const inputHTML = '<input id="nameInput" name="nameInput" type="text" placeholder="name" autocomplete="off" style="width: 300px; height: 40px; font-size: 22px; text-align: center">';
    const chatInput = this.add.dom(SCREEN_WIDTH / 2, 550).createFromHTML(inputHTML).getChildByID("nameInput") as HTMLInputElement;

    const loginbtn = this.add.rectangle(SCREEN_WIDTH / 2, 620, 300, 75, 0xB0B0B0);
    this.add.text(SCREEN_WIDTH / 2 - 45, 600, "Login", {align: "center"}).setFontSize(30);
    this.add.text(SCREEN_WIDTH / 2 + 345, SCREEN_HEIGHT / 2 + 360, "Copyright ©2022 Debuz Co.,Ltd. All Right Reserved.", {align: "center"}).setFontSize(14).setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      window.open("https://www.debuz.com");
    });

    chatInput.focus();
    loginbtn.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
    if (chatInput.value !== undefined && chatInput.value !== "") {
        this.onLoginClicked?.(chatInput.value);
      }
    });
  }
}
