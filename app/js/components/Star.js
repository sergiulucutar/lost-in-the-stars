class Star {

  constructor(id, position) {
    this.id = id;
    this.position = position;
    this.radius = 4 * (Math.floor(Math.random() * 3) + 1);

    this.isHome = false;
    this.isVisibleFromEvent = false;

    this.brightness = {
      min: 25,
      max: 50,
      speed: Math.random() / 3,
      value: 30
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

    // const gradient = context.createRadialGradient(this.position.x, this.position.y, this.radius, this.position.x, this.position.y, 0);
    // gradient.addColorStop(0, this.color);
    // gradient.addColorStop(1, 'white');
    // context.fillStyle = gradient;

    context.shadowBlur = this.brightness.value;
    context.shadowColor = this.color;

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
