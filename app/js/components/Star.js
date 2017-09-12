class Star {

  constructor(id, position) {
    this.id = id;
    this.position = position;
    this.radius = 4 * (Math.floor(Math.random() * 3) + 1);

    this.isHome = false;
    this.isVisibleFromEvent = false;

    this.brightness = {
      min: 50,
      max: 100,
      speed: Math.random() / 10 + 0.12,
      value: 55
    }
    this.getColor();
  };

  update() {
    this.shine();
  }

  render(context) {
    context.fillStyle = this.color;
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

  getColor() {
    let random = Math.floor(Math.random() * 4) + 1;
    switch(random) {
      case 4: this.color = 'orange';
        break;
      case 3: this.color = 'purple';
        break;
      case 2: this.color = 'cyan';
        break;
      default: this.color = 'white';
    }
  }
};
