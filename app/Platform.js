Class("Platform", {
    Platform: function() {
        
        this.MAX_X = 490
        this.MINUS_MAX_X = -490
        this.MAX_Z = 990
        this.MINUS_MAX_Z = -990

        // creating lights?
        this.l0 = new THREE.DirectionalLight(0xffffff, 1);
        this.l0.position.set(500, 100, -1000);
        this.l0.castShadow = true;
        this.l0.shadowDarkness = 0.3;
        //app.scene.add(this.l0);

        this.l1 = new THREE.DirectionalLight(0xffffff, 1);
        this.l1.position.set(-500, 100, -1000);
        this.l1.castShadow = true;
        this.l1.shadowDarkness = 0.3;
        app.scene.add(this.l1);

        this.l2 = new THREE.DirectionalLight(0xffffff, 1);
        this.l2.position.set(500, 100, 1000);
        this.l2.castShadow = true;
        this.l2.shadowDarkness = 0.3;
        app.scene.add(this.l2);

        this.l3 = new THREE.DirectionalLight(0xffffff, 2);
        this.l3.position.set(-500, 100, 1000);
        this.l3.castShadow = true;
        this.l3.shadowDarkness = 0.3;
        //app.scene.add(this.l3);

        // creating platform
        var texture = THREE.ImageUtils.loadTexture( "img/platform_base.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(20, 20);
        var geometry = new THREE.BoxGeometry(1000, 10, 2000);
        var material = new THREE.MeshLambertMaterial({
            ambient: 0xffffff,
            color: 0xffffff,
            specular: 0x555555,
            shininess: 30,
            map: texture,
        });

        this.base = new Mesh(geometry, material);
        this.base.mesh.material.needsUpdate = true;
        this.base.mesh.castShadow = true;
        this.base.mesh.receiveShadow = true;

        this.l0.target = this.l1.target = this.l2.target = this.l3.target = this.base.mesh;

        // creating poles
        var polegeometry = new THREE.CylinderGeometry(5, 5, 500, 32);
        var texture = THREE.ImageUtils.loadTexture( "img/platform_pole.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);

        var polematerial = new THREE.MeshLambertMaterial({
            ambient: 0xffffff,
            color: 0x1e824c,
            specular: 0x555555,
            shininess: 30,
            map: texture,
        });

        this.pole1 = new Mesh(polegeometry, polematerial);
        this.pole1.mesh.position.set(500, 50, -1000);
        this.pole1.mesh.material.needsUpdate = true;
        this.pole1.mesh.castShadow = true;
        this.pole1.mesh.receiveShadow = true;

        this.pole2 = new Mesh(polegeometry, polematerial)
        this.pole2.mesh.position.set(-500, 50, -1000)
        this.pole2.mesh.material.needsUpdate = true;
        this.pole2.mesh.castShadow = true;
        this.pole2.mesh.receiveShadow = true;

        this.pole3 = new Mesh(polegeometry, polematerial)
        this.pole3.mesh.position.set(-500, 50, 1000)
        this.pole3.mesh.material.needsUpdate = true;
        this.pole3.mesh.castShadow = true;
        this.pole3.mesh.receiveShadow = true;

        this.pole4 = new Mesh(polegeometry, polematerial)
        this.pole4.mesh.position.set(500, 50, 1000)
        this.pole4.mesh.material.needsUpdate = true;
        this.pole4.mesh.castShadow = true;
        this.pole4.mesh.receiveShadow = true;

        // creting top part
        var geometry = new THREE.BoxGeometry(1000, 10, 2000);
        var texture = THREE.ImageUtils.loadTexture( "img/platform_base.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        var material = new THREE.MeshLambertMaterial({
            ambient: 0xffffff,
            color: 0x777777,
            specular: 0x555555,
            shininess: 30,
            map: texture,
        });

        this.top = new Mesh(geometry, material)
        this.top.mesh.position.y = 200
        this.top.mesh.material.needsUpdate = true;
        this.top.mesh.castShadow = true;
        this.top.mesh.receiveShadow = true;

        // creating walls
        this.walls = []
        var texture = THREE.ImageUtils.loadTexture( "img/platform_wall.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(17, 5);

        var material = new THREE.MeshLambertMaterial({
            ambient: 0xffffff,
            color: 0xfde3a7,
            specular: 0x555555,
            shininess: 30,
            map: texture,
        });
        var geometry = new THREE.BoxGeometry(10, 100, 2200);

        this.walls.push(new Mesh(geometry, material))
        this.walls[0].mesh.position.set(-500, 0, 0)
        this.walls[0].mesh.material.needsUpdate = true;
        this.walls[0].mesh.castShadow = true;
        this.walls[0].mesh.receiveShadow = true;

        this.walls.push(new Mesh(geometry, material))
        this.walls[1].mesh.position.set(500, 0, 0)
        this.walls[1].mesh.material.needsUpdate = true;
        this.walls[1].mesh.castShadow = true;
        this.walls[1].mesh.receiveShadow = true;

        var geometry = new THREE.BoxGeometry(1200, 100, 10);

        this.walls.push(new Mesh(geometry, material))
        this.walls[2].mesh.position.set(0, 0, -1000)
        this.walls[2].mesh.material.needsUpdate = true;
        this.walls[2].mesh.castShadow = true;
        this.walls[2].mesh.receiveShadow = true;

        this.walls.push(new Mesh(geometry, material))
        this.walls[3].mesh.position.set(0, 0, 1000)
        this.walls[3].mesh.material.needsUpdate = true;
        this.walls[3].mesh.castShadow = true;
        this.walls[3].mesh.receiveShadow = true;

        // this need to be empty
        this.obstacles = [];

    },

    removeAllObstacles: function() {
        // removing obstacles from scene
        for (var i=0; i<this.obstacles.length; i++) {
            app.scene.remove(this.obstacles[i].mesh);
        }
        // resetting obstacles
        this.obstacles = [];
    },

    createRandomObstacles: function() {
        var numObstacles = _.random(10, 30);
        var height = _.random(70, 100);
        var positions = [];
        for (var i=0; i<numObstacles; i++) {
            positions.push({
                x: _.random(this.MINUS_MAX_X, this.MAX_X),
                z: _.random(this.MINUS_MAX_Z, this.MAX_Z) 
            });
        }
        this.createObstacles(numObstacles, height, positions);
    },

    createObstacles: function(numObstacles, height, positions) {
        // creating random obstacles
        var texture = THREE.ImageUtils.loadTexture( "img/platform_obstacle.jpg" );
        this.cracked_texture = THREE.ImageUtils.loadTexture( "img/platform_obstacle_cracked.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        //var numObstacles = _.random(10, 30)
        for (var i=0; i<numObstacles; i++) {
            //height = _.random(70, 100)
            width = 80
            var geometry = new THREE.BoxGeometry(
                width,//Math.floor(Math.random() * 100) + 20, 
                height, 
                width//Math.floor(Math.random() * 100) + 20
            );
            var material = new THREE.MeshLambertMaterial({
                ambient: 0xffffff,
                color: 0xf9bf3b,
                specular: 0x555555,
                shininess: 30,
                map: texture,
            });
            var o = new Mesh(geometry, material);
            // setting health
            o.mesh.health = 3000;//_.random(1000, 5000);
            o.mesh.mindistance = width;
            // setting random position
            o.mesh.position.x = positions[i].x;//_.random(this.MINUS_MAX_X, this.MAX_X)
            o.mesh.position.z = positions[i].z;//_.random(this.MINUS_MAX_Z, this.MAX_Z)
            o.mesh.position.y = height/2;
            // settings for lights
            o.mesh.material.needsUpdate = true;
            o.mesh.castShadow = true;
            o.mesh.receiveShadow = true;
            // adding obstacle to array, for mesh collisions
            this.obstacles.push(o.mesh)
        }
    }
});