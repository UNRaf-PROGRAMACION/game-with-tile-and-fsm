import { Scene } from "phaser";
import Obstacles from "../entities/Obstacles";
import Player from "../entities/Player";
import Snowman from "../entities/Snowman";

export class Game extends Scene {
  #cursors;
  #penguin;
  #player;
  #obstacles;
  #snowmen = [];

  constructor() {
    super("Game");
  }

  init() {
    this.#cursors = this.input.keyboard.createCursorKeys();
    this.#obstacles = new Obstacles();
    this.#snowmen = [];

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy();
    });
  }

  create() {
    this.scene.launch("UI");
    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("iceworld", "tiles");

    const ground = map.createLayer("ground", tileset);
    ground.setCollisionByProperty({ collides: true });

    map.createLayer("obstacles", tileset);

    const objectsLayer = map.getObjectLayer("objects");

    objectsLayer.objects.forEach((obj) => {
      const { x = 0, y = 0, width = 0, height = 0, name } = obj;

      switch (name) {
        case "penquin-spawn": {
          this.#penguin = this.matter.add
            .sprite(x + width * 0.5, y, "penquin")
            .setFixedRotation();

          this.#player = new Player(
            this,
            this.#penguin,
            this.#cursors,
            this.#obstacles
          );

          this.cameras.main.startFollow(this.#penguin, true);
          break;
        }
        case "snowman": {
          const snowman = this.matter.add
            .sprite(x, y, "snowman")
            .setFixedRotation();
          const snowmanEntity = new Snowman(this, snowman);
          this.#snowmen.push(snowmanEntity);
          const body = snowman.body;
          body.uuid = snowmanEntity.uuid;
          this.#obstacles.add("snowman", body);
          break;
        }
        case "star": {
          const star = this.matter.add.sprite(x, y, "star", undefined, {
            isStatic: true,
            isSensor: true,
          });

          star.setData("type", "star");
          break;
        }
        case "health": {
          const health = this.matter.add.sprite(x, y, "health", undefined, {
            isStatic: true,
            isSensor: true,
          });

          health.setData("type", "health");
          health.setData("healthPoints", 10);
          break;
        }

        case "spikes": {
          const spike = this.matter.add.rectangle(
            x + width * 0.5,
            y + height * 0.5,
            width,
            height,
            {
              isStatic: true,
            }
          );
          this.#obstacles.add("spikes", spike);
          break;
        }
      }
    });
    this.matter.world.convertTilemapLayer(ground);
  }

  destroy() {
		this.scene.stop('UI')
	}

	update(t, dt) {
		this.#player?.update(dt)
		this.#snowmen.forEach(snowman => snowman.update(dt))
	}

  starsCollected() {
    this.scene.get("UI").handleStarCollected();
  }

  healthChanged(value) {
    this.scene.get("UI").handleHealthChanged(value);
  }

  snowmanStomped(snowmanUUID) {
    this.#snowmen.forEach((snowman) => {
      if (snowman.uuid === snowmanUUID) {
        snowman.handleStomped();
      }
    });
  }
}
