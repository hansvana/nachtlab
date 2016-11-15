require("babel-polyfill");
const Logo = require("./Logo.es6");

class NachtLab {

  constructor() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    this.camera.position.set( 0, 0, 500 );
    this.container = new THREE.Object3D();
    this.scene.add(this.camera);

    this.jigglers = [];
    for (let i = 0; i < 6; i++) {
      this.jigglers.push({
        x: 0, y: 0,
        xV: Math.random()*2 -1,
        yV: Math.random()*2 -1,
      })
    }

    this.light = new THREE.PointLight( 0xff0000, 1, 0 );
	  this.light.position.set( -50, 150, 50 );
		this.scene.add( this.light );
    this.light2 = new THREE.PointLight( 0x0000ff, 1, 0 );
    this.light2.position.set( -50, -150, 50 );
    this.scene.add( this.light2 );
    this.light3 = new THREE.PointLight( 0xffff00, 1, 0 );
	  this.light3.position.set( 50, 150, 50 );
		this.scene.add( this.light3 );
    // const light4 = new THREE.PointLight( 0x0000ff, 1, 0 );
    // light4.position.set( 50, -150, 50 );
    // this.scene.add( light4 );

    this.logo = new Logo("NACHT\nLAB",
    data => {
      document.getElementById("loadingMessage").style.display = 'none';
      data.forEach( obj => {
        this.container.add(obj);
      })
    });

    this.scene.add(this.container);
    this.container.rotation.x = 180 * (Math.PI / 180);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( width, height );
    document.body.appendChild( this.renderer.domElement );


    this.render();
  }

  render() {
  	requestAnimationFrame( () => { this.render() } );

    this.jiggle();

    this.light.position.x = this.jigglers[0].x;
    this.light.position.y = this.jigglers[0].y;
    this.light2.position.x = this.jigglers[1].x;
    this.light2.position.y = this.jigglers[1].y;
    this.light3.position.x = this.jigglers[2].x;
    this.light3.position.y = this.jigglers[2].y;

  	this.renderer.render(
      this.scene,
      this.camera
    );
  }

  jiggle() {

    this.jigglers.forEach( j=> {
      j.x += j.xV;
      j.y += j.yV;

      if (j.x < -250 || j.x > 250) j.xV *= -1;
      if (j.y < -250 || j.y > 250) j.yV *= -1;
    });

    this.container.traverse( node => {
      if (node instanceof THREE.Mesh && this.near(node, 80)) {
          node.rotation.x += 0.01;
        }

    })
  }

  near(node, minDist) {
    let isNear = false;

    const f = this.jigglers.find( j => {
      const a = Math.abs(node.position.x - j.x);
      const b = Math.abs(node.position.y - j.y);
      if (a + b < minDist) {
        return true;
      }
    })

    return !!f;
  }

}

window.addEventListener("load", function(event) {
    const n = new NachtLab();
});
