class EventHandler {

  constructor(canvas) {
    this.canvas = canvas;
    this.handlers = [];
  }

  listen() {
    this.canvas.addEventListener('click', event => {
      this.handlers.forEach(handler => {
        if((handler.area.radius && Utils.inCircleArea({x: event.offsetX, y: event.offsetY}, handler.area))
          || (handler.area.dimensions && Utils.inRectangularArea({x: event.offsetX, y: event.offsetY}, handler.area))) {
          handler.callback();
        }
      });
    });
  }

  registerEvent(event, area, callback) {
    this.handlers.push({
      event,
      area,
      callback
    });
  }
};
