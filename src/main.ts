import Phaser from "phaser";
import { Client, EnvironmentEndpoint } from "./client";

export const SCREEN_WIDTH = 1920;
export const SCREEN_HEIGHT = 1080;
const env: EnvironmentEndpoint =
{
  dev: "ws://localhost:4000",
  prod: "wss://debuz-job-application.herokuapp.com",
};

const phaserConfig: Phaser.Types.Core.GameConfig =
{
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    autoRound: true,
  },
  audio: {
    noAudio: false
  },
  parent: 'domDiv',
  dom: {
    createContainer: true
  },
  physics: {
    default: "false",
  },
  fps: {
    min: 10,
    target: 60,
  },
};

Client.newClient(phaserConfig, env);

console.log(`client started on ${new Date().toLocaleString()}`);
