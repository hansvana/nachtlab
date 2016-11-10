class Dot {
  constructor(x=0, y=0) {
    this.pos = {x,y};
    this.size = 3;
  }

  draw(ctx) {
    this.pos.x += Math.random() * 0.4 -.2;
    ctx.fillRect(this.pos.x,this.pos.y,this.size,this.size);
  }

  drawLine(dot,ctx) {
    console.log("l");
    ctx.beginPath();
    ctx.moveTo(this.pos.x,this.pos.y);
    ctx.lineTo(dot.pos.x,dot.pos.y);
    ctx.stroke();
  }

  findPeer(arr) {
    return arr.find(dot => {
      const a = this.pos.x - dot.pos.x;
      const b = this.pos.y - dot.pos.y;

      return (a !== 0 && a < 20 && a > -20 && b !== 0 && b < 20 && b > -20);
    })
  }
}

module.exports = Dot;
