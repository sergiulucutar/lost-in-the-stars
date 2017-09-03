class Pointer{

  constructor(player, target) {
    this.player = player;
    this.target = target;

    this.isVisible = false;
  }

  calculatePivotPoint() {
    let distance, ratio,
      x1 = this.player.position.x,
      y1 = this.player.position.y,
      x2 = this.target.position.x,
      y2 = this.target.position.y;

    distance = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2 - y1) * (y2 - y1)));
    ratio = 100 / distance;

    return {
      x: ratio * x2 + (1 - ratio) * x1,
      y: ratio * y2 + (1 - ratio) * y1
    }
  }

  setVisibility(visibility) {
    this.isVisible = visibility;
  }

  render(context) {
    let playerViewRange = {
      position: this.player.position,
      radius: this.player.viewRadius
    };

    if(this.isVisible && !Utils.inCircleArea(this.target.position, playerViewRange)) {
      let angle = Math.atan2(this.player.position.y - this.target.position.y, this.player.position.x - this.target.position.x) * 180 / Math.PI,
          pivot = this.calculatePivotPoint();

      context.save();
      context.translate(pivot.x, pivot.y);
      context.rotate(angle*Math.PI/180);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(25, 25);
      context.lineTo(25, -25);
      context.fillStyle = 'white';
      context.fill();
      context.closePath();
      context.restore();
    }
  }
}
