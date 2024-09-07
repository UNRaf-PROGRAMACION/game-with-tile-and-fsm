import { Scene } from "phaser";

export class UI extends Scene {
  #starsLabel;
  #starsCollected = 0;
  #graphics;
  #lastHealth = 100;

  constructor() {
    super("UI");
  }

  init() {
    this.#starsCollected = 0;
  }

  create() {
    this.#graphics = this.add.graphics();
    this.setHealthBar(100);

    this.#starsLabel = this.add.text(10, 35, "Stars: 0", {
      fontSize: "32px",
    });
  }

  setHealthBar(value) {
    const width = 200;
    const percent = Phaser.Math.Clamp(value, 0, 100) / 100;

    this.#graphics.clear();
    this.#graphics.fillStyle(0x808080);
    this.#graphics.fillRoundedRect(10, 10, width, 20, 5);
    if (percent > 0) {
      this.#graphics.fillStyle(0x00ff00);
      this.#graphics.fillRoundedRect(10, 10, width * percent, 20, 5);
    }
  }

  handleHealthChanged(value) {
    this.tweens.addCounter({
      from: this.#lastHealth,
      to: value,
      duration: 200,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween) => {
        const value = tween.getValue();
        this.setHealthBar(value);
      },
    });

    this.#lastHealth = value;
  }

  handleStarCollected() {
    console.log("star collected");
    ++this.#starsCollected;
    this.#starsLabel.text = `Stars: ${this.#starsCollected}`;
  }
}
