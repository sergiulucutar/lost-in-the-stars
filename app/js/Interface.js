class Interface {

   constructor(canvas) {
      this.canvas = canvas;
      this.showDeathScreen = false;
      this.showSuccessScreen = false;

      this.splitter = {
         length: 90,
         position: {
            x: this.canvas.width / 2,
            y: this.canvas.height - 100
         }
      };

      this.recoverButton = new Button({
         x: this.canvas.width/2 + 50,
         y: this.canvas.height - 50
      },
      'Absorb');

      this.searchButton = new Button({
         x: this.canvas.width/2 + 50,
         y: this.canvas.height - 90
      },
      'Wonder');

      this.consumeButton = new Button({
         x: this.canvas.width/2 - 170,
         y: this.canvas.height - 50
      },
      'Consume');

      this.getClueButton = new Button({
         x: this.canvas.width/2 - 170,
         y: this.canvas.height - 90
      },
      'Get Clue');

      this.popupButton = new Button({
         x: this.canvas.width/2 - 50,
         y: this.canvas.height/2 + 50
      },
      'Close',
      {
         background: '#17131c',
         text: 'white'
      });

      this.artefactsCounter = {
         position: {
            x: this.canvas.width/2 - 325,
            y: this.canvas.height - 60
         }
      };

      this.message = {
         opacity: 0,
         text: ""
      };
   }

   onLevelInit(player, goal) {
      this.player = player;
      this.pointer = new Pointer(this.player, goal);

      this.player.onDestinationReached(energy => {
         this.notifyEnergy(energy);
      });
   }

   //When player is dead
   onGameOverScreen() {
     this.showDeathScreen = true;
   }

   //When player reach the destination
   onSuccessScreen() {
      this.showSuccessScrenn = true;
   }

   render(context) {
      context.font = "bold 18px sans-serif";
      context.textAlign = "center";
      context.fillStyle = 'white';

      //Draw splitter
      context.beginPath();
      context.moveTo(this.splitter.position.x, this.splitter.position.y);
      context.lineTo(this.splitter.position.x, this.splitter.position.y + this.splitter.length);
      context.stroke();

      //Draw the energy orb
      let barStartingPoint = this.canvas.width/2 + 210;
      // context.fillRect(barStartingPoint, this.canvas.height - 30, this.player.energy * 3, 20);
      context.beginPath();
      context.save();
      context.translate(barStartingPoint + 50, this.canvas.height - 60);
      //only God knows what i did here (and why it works)
      context.rotate((- this.player.energy * Math.PI * 1.8 / 180) + 33);
      context.arc(0, 0, 40, 0, Math.PI * 2 * (this.player.energy / 100), false);
      context.restore();
      context.closePath();
      context.fill();

      //Drawe excess energy bar
      if(this.player.excessEnergy > 0) {
         context.fillStyle = 'cyan';
         context.beginPath();
         context.save();
         context.translate(barStartingPoint + 180, this.canvas.height - 60);
         //only God knows what i did here (and why it works)
         context.rotate((- this.player.excessEnergy * Math.PI * 1.8 / 180) + 33);
         context.arc(0, 0, 40, 0, Math.PI * 2 * (this.player.excessEnergy / 100), false);
         context.restore();
         context.closePath();
         context.fill();
      }

      this.searchButton.render(context);
      this.recoverButton.render(context);
      this.consumeButton.render(context);
      this.getClueButton.render(context);

      //draw artefacts number
      context.fillStyle = 'white';
      context.fillText('Artefacts: ' + this.player.artefacts, this.artefactsCounter.position.x + this.recoverButton.dimensions.width/2, this.artefactsCounter.position.y + this.recoverButton.dimensions.height/2 + 6);

      //draw pointer
      context.fillStyle = 'white';
      this.pointer.render(context);

      //draw game over screen
      if(this.showDeathScreen) {
         this.drawPopUp(context, "You are exhausted. You have no energy left to travel.");
      }

      //draw game over screen
      if(this.showSuccessScrenn) {
         this.drawSuccessScreen(context);
      }

      if(this.showClueScreen) {
         this.drawPopUp(context, this.clueMessage);
      }

      if(this.message.opacity > 0) {
         context.fillStyle = 'rgba(255, 255, 255, ' + this.message.opacity + ')';
         context.fillText(this.message.text, this.canvas.width / 2, this.canvas.height - 120);
         this.message.opacity -= 0.02;
      }
   }

   drawPopUp(context, text) {
      context.fillRect(this.canvas.width/2 - 300, this.canvas.height/2 - 150, 600, 300);
      // context.font = "bold 18px Arial";
      context.fillStyle = "#17131c";
      context.fillText(text, this.canvas.width/2, this.canvas.height/2);

      this.popupButton.render(context);
   }

   drawSuccessScreen(context) {
      context.fillRect(this.canvas.width/2 - 300, this.canvas.height/2 - 150, 600, 300);
      // context.font = "bold 18px Arial";
      context.fillStyle = "#17131c";
      context.fillText('You have reached the end of the jorney. You are home.', this.canvas.width/2, this.canvas.height/2);

      this.popupButton.render(context);
   }

   showClueMessage(message) {
      this.clueMessage = message;
      this.showClueScreen = true;
   }

   notifyEnergy(amount) {
      let text = '';
      if(amount > 0) {
         text = '+';
      }
      text += amount + ' Energy';
      this.notify(text);
   }

   notify(message) {
      this.message.text = message;
      this.message.opacity = 2;
   }

   toggleButtons(value) {
      this.searchButton.disabled = value;
      this.recoverButton.disabled = value;
      this.getClueButton.disabled = value;
      this.consumeButton.disabled = value;
   }
}
