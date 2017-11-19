class Game {

  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;

    this.backgroudColor = '#17131c'; //'#211c28';

    this.generator = new Generator(this.canvas);
    this.eventHandler = new EventHandler(this.canvas);
    this.interface = new Interface(this.canvas, this.eventHandler);
    this.level = new Level(this.generator, this.eventHandler, this.interface);

    this.showStartScreen = true;
    this.clickToContinueOpacity = {
      sign: 1,
      value: 0.2
    };
  }

  clickOnCanvas() {
    if(this.showStartScreen) {
      this.showStartScreen = false;
      this.level.init();
    }
  }

  clickPopupButtonButtonCallback(){
    if(this.level.gameOver) {
      this.interface = new Interface(this.canvas, this.eventHandler);
      this.level = new Level(this.generator, this.eventHandler, this.interface);
      this.showStartScreen = true;
    }
  }

  drawStartScreen() {
    this.context.fillStyle = 'white';
    //Draw title
    this.context.font = "bold 60px sans-serif";
    this.context.fillText('Lost in the Stars', this.canvas.width/2 - 225, this.canvas.height/2 - 200);

    //Draw text
    this.context.font = "18px sans-serif";
    this.context.fillText('Without guidance, the wondering spirits, sometimes, lose their way within the stars.', this.canvas.width/2 - 320, this.canvas.height/2);
    this.context.fillText('Help then, guide them from star to star towards their home.', this.canvas.width/2 - 220, this.canvas.height/2 + 30);

    //Draw instruction
    this.context.font = "24px sans-serif";
    this.context.fillStyle = 'rgba(255, 255, 255, ' + this.clickToContinueOpacity.value + ')';
    this.context.fillText('Click to continue', this.canvas.width/2 - 85, this.canvas.height - 100);
  }

  init() {
    this.eventHandler.listen();

    this.eventHandler.registerEvent(
      'click',
      {
         position: {x: 0, y: 0},
         dimensions: {width: this.canvas.width, height: this.canvas.height}
      },
      this.clickOnCanvas.bind(this)
    );

    this.eventHandler.registerEvent(
       'click',
       {
          position: this.interface.popupButton.position,
          dimensions: this.interface.popupButton.dimensions
       },
       this.clickPopupButtonButtonCallback.bind(this)
    );
  }

  render() {
    //Draw background
    let grd = this.context.createLinearGradient(0,0,this.canvas.width, this.canvas.height);
    grd.addColorStop(0,'#0a080c');
    grd.addColorStop(1,this.backgroudColor);
    this.context.fillStyle = grd;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if(!this.showStartScreen) {
      this.level.render(this.context);
      this.interface.render(this.context);
    } else {
      this.drawStartScreen();
    }
  }

  update() {
    if(this.showStartScreen) {
      this.updateClickToContinueButton();
    }

    //Update state
    this.level.update();

    //Render scene
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.render();

    window.requestAnimationFrame(this.update.bind(this));
  }

  updateClickToContinueButton() {
    if(this.clickToContinueOpacity.value >= 1) {
      this.clickToContinueOpacity.sign = -1;
    }
    if(this.clickToContinueOpacity.value <= 0.2){
      this.clickToContinueOpacity.sign = 1;
    }

    this.clickToContinueOpacity.value += (this.clickToContinueOpacity.sign * 0.01);
  }
};

(function(){
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext("2d");

  // The Scroll bar appears, so substract 1 
  canvas.width = document.documentElement.clientWidth - 1;
  canvas.height = document.documentElement.clientHeight;

  let game = new Game(canvas, context);
  game.init();

  requestAnimationFrame(game.update.bind(game));
})();
