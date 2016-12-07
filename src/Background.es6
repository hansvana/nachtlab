class Background {
  constructor() {
    const geometry = new THREE.PlaneGeometry(1536,1024,10,10);
    const material = new THREE.MeshStandardMaterial({color: 0x53caf5, roughness: 1, metalness: 1, emissive: 0x53caf5, shading: THREE.FlatShading});

    geometry.vertices.forEach(v => {
      v.x += Math.random() * 100 -50;
      v.y += Math.random() * 100 -50;
      v.z += Math.random() * 50 -25;
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.z = -100;

    const texture = new THREE.TextureLoader().load( "img/project4.png" );
    const RobotMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: true});



  }

  update() {
    // console.log(this.mesh.geometry.vertices[0].z);
    // this.mesh.geometry.vertices.forEach(v => {
    //   v.z = Math.random() * 50 -25;
    // })
  }
}

module.exports = Background;
