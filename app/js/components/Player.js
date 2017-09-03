class Player {

  constructor(position) {
    this.position = position;
    this.offset = 40;

    this.energy = 100;
    this.viewRadius = this.energy * 3;
    this.actionSpent = false;
    this.path = [0];

    this.speed = 10;
    this.rotationAngle = 50;
    this.playIdle = true;
  }

  calculateRation(pointA, pointB) {
    return Math.abs(pointA - pointB) / this.movement.velocity;
  }

  pushToPath(id) {
    this.path.push(id);
  }

  render(context) {
    //draw player dot
    context.save();
    context.fillStyle = 'white';
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotationAngle / 100);
    context.translate(this.offset, 0);
    context.beginPath();
    context.arc(0, 0, 5, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
    context.restore();

    if(this.playIdle) {
      this.rotationAngle > 630 ? this.rotationAngle = 1 : this.rotationAngle++;
    }

    //draw player rangeView
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.viewRadius + 5, 0, 2 * Math.PI, false);
    context.lineWidth = 1;
    context.strokeStyle = 'white';
    context.stroke();
    context.closePath();
  }

  setPosition(position) {
    this.position = position;
    this.adjustEnergy(-10);
  }

  travelTo(position) {
    this.target = position;
    this.adjustEnergy(-10);
    this.playIdle = false;
  }

  update() {
    if(this.target) {

      let distance = Utils.calculateDistance(this.position, this.target),
          newX = this.position.x + ((this.target.x - this.position.x) / distance) * this.speed,
          newY = this.position.y + ((this.target.y - this.position.y) / distance) * this.speed;

      if(Utils.calculateDistance(this.position, this.target) < Utils.calculateDistance(this.position, {x: newX, y: newY})) {
        this.position.x = this.target.x;
        this.position.y = this.target.y;
        this.target = null;
        this.playIdle = true;

        return;
      }

      this.position.x = newX;
      this.position.y = newY;
    }
  }

  adjustEnergy(amount) {
    this.energy += amount;
    this.viewRadius += amount * 3;
  }
};
