Class("Player", {
    Player: function() {
        // we need to create a player object following the camera object.
        var geometry = new THREE.SphereGeometry( 15, 32, 32 );
        //var geometry = new THREE.BoxGeometry(25, 10, 50);
        var texture = THREE.ImageUtils.loadTexture( "img/player_body.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        var material = new THREE.MeshPhongMaterial({
            ambient: 0xffffff,
            color: 0x0033ff,
            specular: 0x555555,
            shininess: 30,
            map: texture,
        });

        this.body = new Mesh(geometry, material);
        this.body.mesh.position.y = 25;
        this.body.mesh.material.needsUpdate = true;
        this.body.mesh.castShadow = true;
        this.body.mesh.receiveShadow = true;

        // creating guns
        var texture = THREE.ImageUtils.loadTexture( "img/player_gun.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(17, 5);

        var gunmaterial = new THREE.MeshPhongMaterial({
            ambient: 0xffffff,
            color: 0x0033ff,
            specular: 0x555555,
            shininess: 30,
            map: texture,
        });
        var gungeometry = new THREE.BoxGeometry(3, 3, 30);

        var guns = []
        guns.push(new THREE.Mesh(gungeometry, gunmaterial))
        this.body.mesh.add(guns[0])
        guns[0].position.set(-9, 0, 10)
        guns[0].material.needsUpdate = true;
        guns[0].castShadow = true;
        guns[0].receiveShadow = true;

        guns.push(new THREE.Mesh(gungeometry, gunmaterial))
        this.body.mesh.add(guns[1])
        guns[1].position.set(9, 0, 10)
        guns[1].material.needsUpdate = true;
        guns[1].castShadow = true;
        guns[1].receiveShadow = true;


    }
});