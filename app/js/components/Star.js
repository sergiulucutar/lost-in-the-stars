class Star {

  constructor(id, x = 0, y = 0) {
    this.id = id;
    this.position = {x, y};
    this.radius = 9;

    this.isHome = false;
    this.isVisibleFromEvent = false;

    this.brightness = {
      min: 50,
      max: 100,
      speed: Math.random() / 10 + 0.1,
      value: 55
    }
  };

  update() {
    this.shine();
  }

  render(context) {
    //this.isHome ? context.fillStyle = 'green' :
    context.fillStyle = 'white';
    context.save();
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);

    context.shadowBlur = this.brightness.value;
    context.shadowColor = "white";

    context.closePath();
    context.fill();
    context.restore();
  };

  shine() {
    if(this.brightness.value >= this.brightness.max || this.brightness.value <= this.brightness.min) {
      this.brightness.speed *= -1;
    }

    this.brightness.value += this.brightness.speed;
  }
};
