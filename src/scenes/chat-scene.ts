import { SCREEN_HEIGHT, SCREEN_WIDTH } from "~/main";
import { ListArea } from "./components/list-area";

const NAME = "ChatScene";
const LINE_MAX = 31;

export class ChatScene extends Phaser.Scene
{
  private users: Map<number, UserData>;
  private ud?: UserData;
  private lines: string[];
  private onMessageEnter?: (message: string, ud?: UserData) => void;
  private onPrivateMessageEnter?: (receiverId: number, message: string, ud?: UserData) => void;
  private chatArea?: Phaser.GameObjects.Text;
  private myName: string;
  private listArea: ListArea;
  private receiverId?: number

  public constructor(displayName: string, onMessageEnter?: (message: string, ud?: UserData) => void, onPrivateMessageEnter?: (receiverId: number, message: string, ud?: UserData) => void)
  {
    super(NAME);

    this.users = new Map<number, UserData>();
    this.ud = undefined;
    this.lines = [];
    this.listArea = new ListArea(this);
    this.onMessageEnter = onMessageEnter;
    this.onPrivateMessageEnter = onPrivateMessageEnter;
    this.myName = displayName;
    this.receiverId = undefined;
  }

  public getName() { return NAME; }

  protected preload()
  {
    //
  }

  protected create()
  {
    const container = this.add.container(192, 58);
    container.add(this.add.rectangle(0, 0, SCREEN_WIDTH * 0.8, SCREEN_HEIGHT * 0.8, 0x3C3C3C).setOrigin(0, 0));
    container.add(this.add.rectangle(10, 10, 1060, 800, 0xF1F1F1).setOrigin(0, 0));
    container.add(this.add.rectangle(1078, 10, 450, 70, 0xC0C0C0).setOrigin(0, 0));
    container.add(this.add.text(1078 + 450 / 2, 20, `- ${this.myName} -`, {align: "center"}).setOrigin(0.5, 0).setFontSize(36).setSize(450, 70));

    const sendbtn = this.add.rectangle(939, 816, 130, 43, 0xB0B0B0).setOrigin(0, 0);
    container.add(sendbtn);
    container.add(this.add.text(965, 825, "Send", {align: "center"}).setFontSize(26));
    this.chatArea = this.add.text(18, 7, "", {align: "left"}).setFontSize(24).setColor("757575");
    container.add(this.chatArea);

    const msgHTML = '<input id="msginput" name="nameInput" type="text" placeholder="public message" autocomplete="off" style="width: 922px; height: 40px; font-size: 22px;">';
    const msginput = (this.add.dom(664, SCREEN_HEIGHT - 185).createFromHTML(msgHTML).getChildByID("msginput") as HTMLInputElement);
    msginput.focus();

    this.listArea.create(1270, 145, 450, 771);

    const func = () => {
      if (msginput.value !== undefined && msginput.value !== "") {
        if(this.receiverId !== undefined) {
          this.onPrivateMessageEnter?.(this.receiverId, msginput.value)
        } else {
          this.onMessageEnter?.(msginput.value);
        }
        msginput.value = "";
      }

      msginput.focus();
    }

    msginput.addEventListener("keydown", (ev) => { if (ev.key === "Enter") func(); });
    sendbtn.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => { func(); });

    this.listArea.onClickEvent((selected, ud) => {
      this.receiverId = selected ? ud.userId : undefined;
      msginput.placeholder = selected ? "private message" : "public message";
    });
  }

  public chat(senderId: number, sender: string, chat: string)
  {
    this.chatArea?.setText(this.makeLines(`[PUBLIC]${sender}[${senderId}]: ${chat}`))
  }

  public privateChat(receiverId: number, chat: string)
  {
    this.chatArea?.setText(this.makeLines(`[PRIVATE]${this.ud?.displayName}[${this.ud?.userId}]: ${chat}`))
  }

  public addUserData(userId: number, displayName: string)
  {
    console.log("addUserData", userId, displayName);
    this.ud = {
      userId,
      displayName
    };
  }

  public addUser(userId: number, displayName: string)
  {
    console.log("addUser", userId, displayName);
    this.users.set(userId, {
      userId,
      displayName
    });
    this.listArea.addUser({ userId, displayName });
  }

  public removeUser(userId: number)
  {
    console.log("removeUser", userId);
    this.users.delete(userId);
    this.listArea.removeUser(userId);
  }

  private makeLines(message: string)
  {
    const length = this.lines.length
    if (length >= LINE_MAX) this.lines.shift();

    this.lines.push(message);

    return this.lines;
  }
}

export interface UserData
{
  userId: number;
  displayName: string;
}