const Phaser = require("phaser");

type GameConfig = Phaser.Types.Core.GameConfig;

const config: GameConfig = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  parent: 'game',
  scene: {
    preload: preload,
    create: create,
	update: update
  }
}

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config)
  }
}

function preload ()
{
	this.load.image('pixel_black', 'pixel_black_20.png');
	this.load.image('pixel_white', 'pixel_white_20.png');
}

function create ()
{
	this.add.image(100, 100, 'pixel_white');
	this.add.image(121, 100, 'pixel_black');
}

function update ()
{
	this.add.image(100, 200, 'pixel_white');
}

const game = new Game(config)
