class Generator {

  constructor(canvas) {
    let padding = 100;
    this.area = {
      maxWith: canvas.width - 2 * padding,
      maxHeight: canvas.height - 2 * padding,
      minWidth: padding,
      minHeight: padding
    };
  };

  generateStars(amount = 50) {
    let stars = [], x, y;

    for(let i = 0; i < amount; i++) {
      x = Math.floor(Math.random() * this.area.maxWith) + this.area.minWidth;
      y = Math.floor(Math.random() * this.area.maxHeight) + this.area.minHeight;

      stars.push(new Star(i, {x, y}));
    }

    return stars;
  };
};
