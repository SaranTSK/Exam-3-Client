import { UserData } from "../chat-scene";

export class ListArea
{
  private udids: Map<number, number>;
  private udTexts: UserDataText[];
  private scene: Phaser.Scene;
  private container?: Phaser.GameObjects.Container;
  private udSelected: UserDataSelected;
  private lineMax: number;

  private onClick?: (selected: boolean, ud: UserData) => void;

  public constructor(scene: Phaser.Scene, lineMax = 24)
  {
    this.udids = new  Map<number, number>();
    this.udTexts = [];
    this.scene = scene;
    this.udSelected = {};
    this.lineMax = lineMax;
  }

  public create(x: number, y: number, width: number, height: number)
  {
    this.container = this.scene.add.container(x, y);
    this.container.add(this.scene.add.rectangle(0, 0, width, height, 0xF1F1F1).setOrigin(0, 0))

    let py = 0;
    for (let i = 0; i < this.lineMax; i++)
    {
      const text = this.scene.add.text(width / 2, py, "", {align: "center"}).setOrigin(0.5, 0).setFontSize(24).setColor("757575").setSize(width, 32);
      text.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => { this.onClickText(text, i); });
      this.container.add(text);
      this.udTexts.push({ text });
      py += 32;
    }
  }

  public addUser(ud: UserData)
  {
    const size = this.udids.size;
    if (size < this.lineMax)
    {
      this.udids.set(ud.userId, size);

      this.udTexts[size].ud = ud;
      this.udTexts[size].text.text = ud.displayName;
    }
  }

  public removeUser(userId: number)
  {
    const idx = this.udids.get(userId);
    if (idx !== undefined)
    {
      // un select
      const ud = this.udTexts[idx].ud;
      if (ud) this.onClick?.(false, ud);

      // delete
      this.udids.delete(userId);

      // move
      for (let i = idx; i < this.lineMax - 1; i++)
      {
        this.udTexts[i].ud = this.udTexts[i + 1].ud;
        this.udTexts[i].text.text = this.udTexts[i + 1].ud?.displayName ?? "";
      }
      this.udTexts[this.lineMax - 1].ud = undefined;
      this.udTexts[this.lineMax - 1].text.text = "";
    }
  }

  public onClickEvent(ev: (selected: boolean, ud: UserData) => void)
  {
    this.onClick = ev;
  }

  private onClickText(text: Phaser.GameObjects.Text, idx: number)
  {
    const ud = this.udTexts[idx].ud;
    if (ud !== undefined)
    {
      const selected = this.udSelected
      if (selected.idx === idx)
      {
        selected.idx = undefined;
        if (selected.graphics)
        {
          this.container?.remove(selected.graphics);

          selected.graphics?.clear();
          selected.graphics = undefined;
        }
        this.onClick?.(false, ud);
      }
      else
      {
        if (selected.idx !== undefined)
        {
          if (selected.graphics)
          {
            this.container?.remove(selected.graphics);
  
            selected.graphics?.clear();
            selected.graphics = undefined;
          }
        }

        selected.idx = idx;
        selected.graphics = this.scene.add.graphics({ lineStyle: { color: 0xFF0000 } }).strokeRect(0, idx*32, 450, 32);
        this.container?.add(selected.graphics);

        this.onClick?.(true, ud);
      }
    }
  }
}

interface UserDataText
{
  ud?: UserData;
  text: Phaser.GameObjects.Text;
}

interface UserDataSelected
{
  graphics?: Phaser.GameObjects.Graphics;
  idx?: number;
}
