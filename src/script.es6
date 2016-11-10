require("babel-polyfill");
const Dot = require("./Dot.es6");

class Logo {
    constructor(txt) {
      const g = this.getCanvas();
      this.canvas = g.next().value;
      this.context = g.next().value;

      this.text = txt;
      this.dots = this.getDots(this.prerender());

      this.draw();
    }

    draw() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = "white";
      this.context.strokeStyle = "white";
      this.dots.forEach(dot => {
          dot.draw(this.context);
          const peer = dot.findPeer(this.dots);
          if (peer) dot.drawLine(peer,this.context);
      })

      //window.requestAnimationFrame(() => {this.draw()});
    }

    prerender() {
      this.context.fillStyle = "white";
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = "black";
      this.context.font = "200px Georgia";
      this.context.textAlign = "center";
      this.context.textBaseline= "middle";

      const txt = this.text.split("\n");
      let height = this.canvas.height * .5 - 100;
      txt.forEach(line => {
        this.context.fillText(line, this.canvas.width * .5, height);
        height += 200;
      })

      return;
    }

    getDots(dimensions) {
      let n = 0;
      let d = [];

      while (n < 750) {
        //const x = this.canvas.width * .5 + Math.random() * dimensions.width - dimensions.width * .5;
        //const y = this.canvas.height * .5 + Math.random() * 200 - 200 * .5;
        const x = Math.random() * this.canvas.width ;
        const y = Math.random() * this.canvas.height;

        const imgData = this.context.getImageData(x, y, 1, 1);
        if (imgData.data[0] == 0 || imgData.data[1] == 0 || imgData.data[2] == 0) {
            d.push(new Dot(x, y));
            n++;
        }
      }

      return d;
    }

    *getCanvas() {
      const c = document.createElement("canvas");
      c.style.backgroundColor = "black";
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      document.body.appendChild(c);
      yield c;
      yield c.getContext("2d");
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    let l = new Logo("Nacht\nLab");
});
