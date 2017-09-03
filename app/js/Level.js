class Level {

  constructor(generator, eventHandler, ui) {
    this.eventHandler = eventHandler;
    this.interface = ui;

    this.stars = generator.generateStars();
    this.goal = this.stars[this.stars.length - 1];
    this.goal.isHome = true;
    this.player = new Player(Object.assign({}, this.stars[0].position));

    this.gameOver = false;
  };

  init() {
    this.interface.onLevelInit(this.player, this.goal);

    this.stars.forEach(star => {
      this.eventHandler.registerEvent(
        'click',
        {
          position: star.position,
          radius: star.radius
        },
        this.clickStarCallback.bind(this, star));
    });

    this.eventHandler.registerEvent(
       'click',
       {
          position: this.interface.searchButton.position,
          dimensions: this.interface.searchButton.dimensions
       },
       this.clickSearchButtonCallback.bind(this)
    );

    this.eventHandler.registerEvent(
       'click',
       {
          position: this.interface.recoverButton.position,
          dimensions: this.interface.recoverButton.dimensions
       },
       this.clickRecoverButtonCallback.bind(this)
    );
  }

  clickStarCallback(star) {
    this.player.travelTo(star.position);
    this.player.pushToPath(star.id);
    this.resetAdvantages();
    this.player.actionSpent = false;
  }

  clickSearchButtonCallback() {
    if(!this.player.actionSpent) {
      this.player.actionSpent = true;
      let random = Math.random();
      if(random > 0.8) {
        this.player.adjustEnergy(20);
        console.log("+ Energy");
      } else if(random > 0.65) {
        //show direction
        this.interface.pointer.setVisibility(true);
        console.log("SHOW DIRECTION");

      } else if(random > 0.6) {
        this.stars.filter(star => star.isHome).map(star => star.isVisibleFromEvent = true);
        console.log("SHOW STAR");
      } else if(random > 0.4) {
        this.player.adjustEnergy(-20);
        console.log("- Energy");
      } else
       if(random > 0.3) {
        //backtrack
        console.log("BACKTRACK");
        let id = this.player.path.slice(-2)[0];
        this.player.travelTo(this.stars.filter(star => star.id === id)[0].position);
      } else if(random > 0.2) {
        //portal
        console.log("PORTAL");
        let id = Utils.randomBetween(1, 19);
        this.player.setPosition(this.stars.filter(star => star.id === id)[0].position);
      }
    }
  }

  clickRecoverButtonCallback() {
    if(!this.player.actionSpent) {
      this.player.actionSpent = true;
      this.player.adjustEnergy(10);
    }
  }

  resetAdvantages() {
    this.interface.pointer.setVisibility(false);
    this.stars.filter(star => star.isHome).map(star => star.isVisibleFromEvent = false);
  }

  render(context) {
    this.stars.forEach(star => {
      if(Utils.inCircleArea(star.position, {
        position: this.player.position,
        radius: this.player.viewRadius
      }) || star.isVisibleFromEvent) {
        star.render(context);
      }
    });
    this.player.render(context);
  };

  update() {
    if(!this.gameOver) {
      if(this.player.energy <= 0) {
        this.gameOver = true;
        this.interface.onGameOverScreen();
      }

      this.stars.forEach(star => {
        star.update();
      });
      this.player.update();
    }
  }
};
