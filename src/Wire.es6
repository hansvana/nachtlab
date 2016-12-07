class Wire {
  constructor(width, height, segmentHeight, position, curviness) {
    this.sizing = {
      height: height,
      width: width,
      segmentHeight: segmentHeight,
      segments: height / segmentHeight,
      halfHeight: height * 0.5
    };
    this.curviness = curviness;
    this.x = 0;

    const geometry = this.getGeometry();
    const material = this.getMaterial();
    const bones = this.getBones();
    this.mesh = this.getMesh( geometry, bones, material );

    this.mesh.position.copy( position );
    console.log(this.mesh.position.x);
    this.mesh.rotation.z = Math.atan2(0-this.mesh.position.y,0-this.mesh.position.x) + (Math.PI* (.5 + (Math.random() * .1 - .05)));
  }

  curve(pos) {
    const bones = this.mesh.skeleton.bones;
    for (var i = 0; i < bones.length; i++) {
      bones[i].rotation.z =
        Math.sin((Date.now()/1000)+i)
        *
        (i / bones.length) * bones[i].multiplier
        +
        bones[i].offset;
    }
  }

  getBones() {
    let bones = [];
    let offset = 0;
    for (let b = 0; b <= this.sizing.segments; b++) {
      const bone = new THREE.Bone();
      bone.position.y = this.sizing.segmentHeight;
      bone.multiplier =  Math.random() * .35;
      bone.offset = offset;
      offset += Math.random() * .01 - .005
      if (b > 0)
        bones[b-1].add(bone);

      bones.push(bone);
    }
    //bones[0].position.y = -this.sizing.halfHeight;
    return bones;
  }

  getGeometry() {
    return this.setSkin( new THREE.CylinderGeometry(
      this.sizing.width,    // radius at top
      this.sizing.width,    // radius at bottom
      this.sizing.height,   // height
      8,                    // radius segments
      this.sizing.segments, // height segments
      false                 // open ended
    ));
  }

  getMaterial() {
    return new THREE.MeshStandardMaterial( {
      skinning : true,
			color: 0xffffff,
		});
  }

  getMesh( geometry, bones, material ) {
    const skeleton = new THREE.Skeleton( bones );
    geometry.translate(0, this.sizing.halfHeight, 0);
    const mesh = new THREE.SkinnedMesh( geometry, material );

    mesh.add( bones[0] );
    mesh.bind( skeleton );

    return mesh;
  }

  getRotation(position) {
    return new THREE.Euler();
  }

  setSkin( geometry ) {
    for ( let i = 0; i < geometry.vertices.length; i ++ ) {
      const y = geometry.vertices[i].y + this.sizing.halfHeight;

      const skinIndex = Math.floor( y / this.sizing.segmentHeight);
      const skinWeight = ( y % this.sizing.segmentHeight ) / this.sizing.segmentHeight;

      geometry.skinIndices.push( new THREE.Vector4( skinIndex, skinIndex + 1, 0, 0 ) );
      geometry.skinWeights.push( new THREE.Vector4( 1 - skinWeight, skinWeight, 0, 0 ) );
    }
    return geometry;
  }
}

module.exports = Wire;
