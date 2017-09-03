class Game {

  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;

    this.backgroudColor = '#17131c'; //'#211c28';

    this.world = {
      size: {
        width: 10000,
        height: 10000
      }
    };

    this.generator = new Generator(this.canvas);
    this.eventHandler = new EventHandler(canvas);
    this.interface = new Interface(this.canvas, this.eventHandler);
    this.level = new Level(this.generator, this.eventHandler, this.interface);
  }

  init() {
    this.level.init();
    this.eventHandler.listen();
  }

  render() {
    //Draw background
    let grd = this.context.createLinearGradient(0,0,this.canvas.width, this.canvas.height);
    grd.addColorStop(0,'#0a080c');
    grd.addColorStop(1,this.backgroudColor);
    this.context.fillStyle = grd;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);


    this.level.render(this.context);
    this.interface.render(this.context);
  }

  update() {
    //Update state
    this.level.update();

    //Render scene
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.render();

    window.requestAnimationFrame(this.update.bind(this));
  }
};

(function(){
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let game = new Game(canvas, context);
  game.init();

  requestAnimationFrame(game.update.bind(game));
})();
