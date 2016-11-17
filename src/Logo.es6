const Dot = require("./Dot.es6");

class Logo {
    constructor(txt, cb) {
      const g = this.getCanvas();
      this.canvas = g.next().value;
      this.context = g.next().value;

      this.text = txt;
      this.polygons = [];
      this.lines = [];
      this.prerender();

      g.next();

      cb(this.polygons, this.lines);
    }

    draw() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.strokeStyle =
      this.polygons.forEach(p => {
          p.draw(this.context);
      })

      //window.requestAnimationFrame(() => {this.draw()});
    }

    prerender() {
      this.context.font = "200px Arial Black";
      this.context.textAlign = "center";
      this.context.textBaseline= "middle";

      const txt = this.text.split("\n");
      let y = this.canvas.height * .5 - 100;

      txt.forEach(line => {
        const chars = line.split("");
        let x = this.canvas.width * .5 - (chars.length * .5 * 150);
        chars.forEach( char => {
          this.context.fillStyle = "black";
          this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.context.fillStyle = "white";
          this.context.fillText(char, x, y);

          this.getPolygons(x, y);
          this.getLines(x, y);

          x += 130;
        })
        y += 200;
      });

      return;
    }

    getPolygons(txtX, txtY) {
      let n = 0;

      const material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff } );
      material.side = THREE.DoubleSide;

      while (n < 200) {
        const x = txtX + (Math.random() * 260 - 130);
        const y = txtY + (Math.random() * 400 - 200);

        const p1 = this.findNearPos({x,y});
        let p2 = false, p3 = false;

        if (p1) {
          p2 = this.findNearPos({x,y});
          p3 = this.findNearPos({x,y});

          if (p1 && p2 && p3) {

            var triangleShape = new THREE.Shape();
            triangleShape.moveTo( 0, 0 );
            triangleShape.lineTo( p2.x - p1.x, p2.y - p1.y );
            triangleShape.lineTo( p3.x - p1.x, p3.y - p1.y );
            triangleShape.lineTo( 0, 0 ); // close path
            var geometry = new THREE.ShapeGeometry( triangleShape );
            var mesh = new THREE.Mesh( geometry, material );

            mesh.rotation.x += Math.random() * 0.6 - 0.3;
            mesh.rotation.y += Math.random() * 0.6 - 0.3;
            mesh.rotation.z += Math.random() * 0.6 - 0.3;
            // mesh.position.x -= window.innerWidth * .5 - p1.x;
            mesh.position.x += p1.x - (window.innerWidth * .5);
            mesh.position.y += p1.y - (window.innerHeight * .5);

            this.polygons.push(mesh);

            n++;
          }
        }
      }
    }

    getLines(txtX, txtY) {
      let geometryFlat = new THREE.Geometry();
      let geometryWire = new THREE.Geometry();

      const letterHeight = 280;
      const letterWidth = 140;
      const steps = 14;
      const yMax = (letterHeight * 2) / steps;
      const xMax = (letterWidth * 2) / steps;

      for (let y = 0; y <= yMax; y++) {
        for (let x = 0; x <= xMax; x++) {

          const offsetX = Math.random() * 6 - 3;
          const offsetY = Math.random() * 6 - 3;
          const offsetZ = Math.random() * 2 - 1;

          geometryWire.vertices.push(
            new THREE.Vector3(
              txtX + (x * steps - letterWidth) + offsetX,
              txtY + (y * steps - letterHeight) + offsetY,
              offsetZ
            )
          );
          geometryFlat = geometryWire.clone();

          if (  y < yMax && x < xMax &&
              this.isInsideCharacter(txtX + (x * steps - letterWidth), txtY + (y * steps - letterHeight)) &&
              this.isInsideCharacter(txtX + ((x+1) * steps - letterWidth), txtY + (y * steps - letterHeight)) &&
              this.isInsideCharacter(txtX + (x * steps - letterWidth), txtY + ((y+1) * steps - letterHeight))
            ) {
              const currV = (y*xMax) + (x+1) + y;
              if (Math.random() * 3 > 1) geometryWire.faces.push( new THREE.Face3( currV, currV+1, currV + xMax + 1 ) );
              if (Math.random() * 3 > 1) geometryFlat.faces.push( new THREE.Face3( currV, currV+1, currV + xMax + 1 ) );
              if (Math.random() * 3 > 1) geometryWire.faces.push( new THREE.Face3( currV+1, currV + xMax + 2, currV + xMax + 1 ) );
              if (Math.random() * 3 > 1) geometryFlat.faces.push( new THREE.Face3( currV+1, currV + xMax + 2, currV + xMax + 1 ) );
          }
        }
      }

      const materialFlat = new THREE.MeshPhongMaterial( { color: 0x111111, specular: 0x000000, shading: THREE.FlatShading } );
      const materialWire = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, wireframe: true} );
      materialFlat.side = THREE.DoubleSide;
      geometryFlat.computeFaceNormals();
      geometryFlat.computeVertexNormals();
      geometryFlat.dynamic = true;
      geometryWire.computeFaceNormals();
      geometryWire.computeVertexNormals();
      geometryWire.dynamic = true;
      let mesh =  new THREE.Mesh( geometryFlat, materialFlat )
      mesh.position.x -= (window.innerWidth * .5) + 20;
      mesh.position.y -= window.innerHeight * .5;
      this.lines.push(mesh);
      mesh =  new THREE.Mesh( geometryWire, materialWire )
      mesh.position.x -= (window.innerWidth * .5) + 20;
      mesh.position.y -= window.innerHeight * .5;
      this.lines.push(mesh);
    }

    isInsideCharacter(x,y) {
      const imgData = this.context.getImageData(x, y, 1, 1);
      if (imgData.data[0] == 255 || imgData.data[1] == 255 || imgData.data[2] == 255) {
        return true;
      }
    }

    findNearPos(pos) {
      let n = 0;
      while (n < 750) {
        const x = pos.x + (Math.random() * 20 - 10);
        const y = pos.y + (Math.random() * 20 - 10);

        if (this.isInsideCharacter(x,y)) {
          return new Dot(x, y);
        }

        n++;
      }
      return false;
    }

    *getCanvas() {
      const c = document.createElement("canvas");
      c.style.backgroundColor = "black";
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      document.body.appendChild(c);
      yield c;
      yield c.getContext("2d");
      document.body.removeChild(c);
      yield;
    }
}

module.exports = Logo;
