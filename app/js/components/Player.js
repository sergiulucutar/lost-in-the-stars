class Player {

  constructor(position) {
    this.position = position;
    this.offset = 40;
    this.path = [0];
    this.actionSpent = false;
    this.artefacts = 0;

    this.energy = 100;
    this.excessEnergy = 0;
    this.viewRadius = this.energy * 3;

    this.speed = 10;
    this.rotationAngle = 50;
    this.playIdle = true;

    this.regenerate = {
      energy: 0,
      excess: 0
    };
  }

  calculateRation(pointA, pointB) {
    return Math.abs(pointA - pointB) / this.movement.velocity;
  }

  onDestinationReached(callback){
    this.reachTargetCallback = callback;
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
  }

  travelTo(star) {
    this.pushToPath(star.id)
    this.target = star;
    this.playIdle = false;
  }

  update() {
    if(this.target) {

      let distance = Utils.calculateDistance(this.position, this.target.position),
          newX = this.position.x + ((this.target.position.x - this.position.x) / distance) * this.speed,
          newY = this.position.y + ((this.target.position.y - this.position.y) / distance) * this.speed;

      //if the player reached the target
      if(Utils.calculateDistance(this.position, this.target.position) < Utils.calculateDistance(this.position, {x: newX, y: newY})) {
        this.position.x = this.target.position.x;
        this.position.y = this.target.position.y;

        //if the target is a new star
        if(this.alreadyVisited(this.target.id) === undefined) {
          this.regenerate.energy += this.target.radius;
          this.reachTargetCallback(this.target.radius);
        }
        this.target = null;
        this.playIdle = true;

        return;
      }

      this.position.x = newX;
      this.position.y = newY;
      this.adjustEnergy(-1.5);
    }

    if(this.regenerate.energy !== 0) {
      let sign = this.regenerate.energy > 0 ? 1 : -1;
      this.adjustEnergy(sign * 1);
      this.regenerate.energy += -1 * sign;
    }

    if(this.regenerate.excess > 0) {
      this.excessEnergy += 1;
      this.regenerate.excess -= 1;
    }
  }

  adjustEnergy(amount) {
    let change;
    //Spend excess energy first
    if(this.excessEnergy > 0 && amount < 0) {
      change = this.excessEnergy + amount;
      if(change <= 0 && this.excessEnergy + amount <= 0) {
        this.excessEnergy = 0;
        this.energy += change;
      }
      this.excessEnergy += amount;
      this.viewRadius = (this.energy + this.excessEnergy) * 3;
      return;
    }
    this.energy = this.energy + amount > 100 ? 100 : this.energy + amount;
    this.viewRadius = (this.energy + this.excessEnergy) * 3;
  }

  absordStar(amount) {
    let excess = this.energy + amount * 3 - 100;
    if(excess > 0) {
      this.regenerate.excess = this.regenerate.excess > 100 ? 100 : this.regenerate.excess + excess;
    }
    this.regenerate.energy += amount;
  }

  alreadyVisited(id) {
    return this.path.slice(0, this.path.length - 2).find(starId => starId === id);
  }

  canTravelToStar(starId) {
    return this.path.slice(-1)[0] !== starId;
  }
};
