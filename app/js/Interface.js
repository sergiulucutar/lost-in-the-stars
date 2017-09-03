class Interface {

   constructor(canvas) {
      this.canvas = canvas;
      this.showGameOverScreen = false;

      this.recoverButton = {
         position: {
            x: this.canvas.width/2 - 300,
            y: this.canvas.height - 30
         },
         dimensions: {
            width: 100,
            height: 20
         }
      };

      this.searchButton = {
         position: {
            x: this.canvas.width/2 - 450,
            y: this.canvas.height - 30
         },
         dimensions: {
            width: 100,
            height: 20
         }
      };
   }

   onLevelInit(player, goal) {
      this.player = player;
      this.pointer = new Pointer(this.player, goal);
   }

   onGameOverScreen() {
     this.showGameOverScreen = true;
   }

   render(context) {
      context.font = "bold 18px Arial";
      context.textAlign = "center";

      //Draw the energy bar
      let barStartingPoint = this.canvas.width/2 - 150;
      context.fillStyle = 'white';
      context.fillRect(barStartingPoint, this.canvas.height - 30, this.player.energy * 3, 20);

      //draw search button
      context.fillRect(this.searchButton.position.x, this.searchButton.position.y,
          this.searchButton.dimensions.width, this.searchButton.dimensions.height);
      context.fillStyle = "#17131c";
      context.fillText('Wonder', this.searchButton.position.x + this.searchButton.dimensions.width/2, this.searchButton.position.y + this.searchButton.dimensions.height/2 + 6);

      //draw recover button
      context.fillStyle = 'white';
      context.fillRect(this.recoverButton.position.x, this.recoverButton.position.y,
          this.recoverButton.dimensions.width, this.recoverButton.dimensions.height);
      context.fillStyle = "#17131c";
      context.fillText('Recover', this.recoverButton.position.x + this.recoverButton.dimensions.width/2, this.recoverButton.position.y + this.recoverButton.dimensions.height/2 + 6);

      //draw pointer
      context.fillStyle = 'white';
      this.pointer.render(context);

      if(this.showGameOverScreen) {
         context.fillRect(this.canvas.width/2 - 300, this.canvas.height/2 - 150, 600, 300);

         context.font = "30px Arial";
         context.fillStyle = "#17131c";
         context.fillText("Game Over", this.canvas.width/2, this.canvas.height/2);
      }
   }
}
