class Button {

  constructor(position, text, colors) {
    this.position = position;
    this.dimensions = {
      width: 120,
      height: 30
    };
    this.colors = colors || {
      background: 'white',
      text: '#17131c'
    }
    this.text = text;

    this.disabled = false;
  }

  render(context) {
    context.fillStyle = this.colors.background;
    if(this.disabled) {
      context.fillStyle = 'gray';
    }

    context.fillRect(this.position.x, this.position.y,
        this.dimensions.width, this.dimensions.height);
    context.fillStyle = this.colors.text;
    context.fillText(this.text, this.position.x + this.dimensions.width/2, this.position.y + this.dimensions.height/2 + 6);
  }
}
