class Level {

  constructor(generator, eventHandler, ui) {
    this.eventHandler = eventHandler;
    this.interface = ui;

    this.stars = generator.generateStars();
    this.goal = this.stars[this.stars.length - 1];
    this.goal.isHome = true;
    this.player = new Player(Object.assign({}, this.stars[0].position));

    this.gameOver = false;

    this.cluesGiven = 0;
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
       this.clickAbsorbButtonCallback.bind(this)
    );

    this.eventHandler.registerEvent(
       'click',
       {
          position: this.interface.consumeButton.position,
          dimensions: this.interface.consumeButton.dimensions
       },
       this.clickConsumeButtonCallback.bind(this)
    );

    this.eventHandler.registerEvent(
       'click',
       {
          position: this.interface.getClueButton.position,
          dimensions: this.interface.getClueButton.dimensions
       },
       this.clickGetClueButtonCallback.bind(this)
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

  clickStarCallback(star) {
    if(this.player.canTravelToStar(star.id) && this.isStarInsideViewingRange(star)) {
      this.player.travelTo(star);
      this.resetAdvantages();
      this.player.actionSpent = false;
    }
  }

  clickSearchButtonCallback() {
    if(!this.player.actionSpent) {
      this.player.actionSpent = true;
      let random = Math.random(),
          energy;
      if(random > 0.9) {
        this.player.artefacts += 2;
        this.interface.notify("+2 Artefacts");
      } else if(random > 0.4) {
        this.player.artefacts ++;
        this.interface.notify("+1 Artefact");
      } else if(random > 0.2) {
        // energy = -1 * Utils.randomBetween(1, 20);
        // this.player.regenerate.energy += energy;
        // this.interface.notifyEnergy(energy);
      } else {
        energy = Utils.randomBetween(1, 20);
        this.player.regenerate.energy += energy;
        this.interface.notifyEnergy(energy);
      }
    }
  }

  clickAbsorbButtonCallback() {
    let starToBeAbsorbed;
    if(!this.player.actionSpent) {
      this.player.actionSpent = true;
      starToBeAbsorbed = this.stars[this.player.path.slice(-1)];
      this.player.absordStar(starToBeAbsorbed.radius);
      this.interface.notifyEnergy(starToBeAbsorbed.radius);
      delete this.stars[starToBeAbsorbed.id];
    }
  }

  clickConsumeButtonCallback() {
    this.player.artefacts--;
    this.player.regenerate.energy += 20;
    this.interface.notifyEnergy(20);
  }

  clickGetClueButtonCallback() {
    if(this.player.artefacts >= this.cluesGiven + 1) {
      switch (this.cluesGiven) {
        case 0:
          this.interface.showClueMessage(this.getColorClueMessage(this.goal.color));
          break;
        case 1:
          this.interface.showClueMessage(this.getSizeClueMessage(this.goal.radius));
          break;
        default:
          this.interface.pointer.setVisibility(true);
      }
      this.cluesGiven++;
      this.player.artefacts -= this.cluesGiven;
    }
  }

  clickPopupButtonButtonCallback() {
    this.interface.showClueScreen = false;
  }

  resetAdvantages() {
    this.interface.pointer.setVisibility(false);
    this.stars.filter(star => star.isHome).map(star => star.isVisibleFromEvent = false);
  }

  render(context) {
    this.stars.forEach(star => {
      if(this.isStarInsideViewingRange(star) || star.isVisibleFromEvent) {
        star.render(context);
      }
    });
    this.player.render(context);
  };

  update() {
    if(!this.gameOver) {
      if(this.player.energy <= 2) {
        this.gameOver = true;
        this.interface.onGameOverScreen();
      }

      //if the player reach the goal, end game
      if(this.player.position.x === this.goal.position.x
          && this.player.position.y === this.goal.position.y) {
        this.gameOver = true;
        this.interface.onSuccessScreen();
      }

      this.stars.forEach(star => {
        star.update();
      });
      this.player.update();
      this.updateButtons();
    }
  }

  updateButtons() {
    if(!this.player.target) {
      this.interface.toggleButtons(false);
    } else {
      this.interface.toggleButtons(true);
    }

    if(this.player.artefacts > this.cluesGiven) {
      this.interface.getClueButton.disabled = false;
    } else {
      this.interface.getClueButton.disabled = true;
    }

    if(this.player.artefacts > 0) {
      this.interface.consumeButton.disabled = false;
    } else {
      this.interface.consumeButton.disabled = true;
    }

    this.interface.searchButton.disabled = this.player.actionSpent;
    this.interface.recoverButton.disabled = this.player.actionSpent;

    //Update the text for get Clue buttons
    this.interface.getClueButton.text = 'Get Clue (' + (this.cluesGiven + 1) + ')';
  }

  getColorClueMessage(color) {
    return "You have a vision. You see a star with " + color + " light.";
  }

  getSizeClueMessage(radius) {
    let size;
    switch(radius) {
      case 12:
        size = 'large';
        break;
      case 8:
        size = 'medium';
        break;
      default:
        size = 'small';
    }

    return "You have another vision. You see a star with " + size + " radius.";
  }

  isStarInsideViewingRange(star) {
    return Utils.inCircleArea(star.position, {
      position: this.player.position,
      radius: this.player.viewRadius
    });
  }
};
