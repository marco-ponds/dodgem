Class("Platform", {
    Platform: function() {
        
        this.MAX_X = 490
        this.MINUS_MAX_X = -490
        this.MAX_Z = 990
        this.MINUS_MAX_Z = -990

        // creating platform
        var texture = THREE.ImageUtils.loadTexture( "img/platform_base.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(20, 20);
        var geometry = new THREE.BoxGeometry(1000, 10, 2000);
        var material = new THREE.MeshPhongMaterial({
            ambient: 0xffffff,
            color: 0xffffff,
            specular: 0x555555,
            shininess: 30,
            map: texture,
        });

        this.base = new Mesh(geometry, material);
        this.base.mesh.material.needUpdate = true;

        // creating poles
        var polegeometry = new THREE.CylinderGeometry(5, 5, 500, 32);
        var texture = THREE.ImageUtils.loadTexture( "img/platform_pole.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);

        var polematerial = new THREE.MeshPhongMaterial({
            ambient: 0xffffff,
            color: 0x1e824c,
            specular: 0x555555,
            shininess: 30,
            map: texture,
        });

        this.pole1 = new Mesh(polegeometry, polematerial);
        this.pole1.mesh.position.set(500, 50, -1000);
        this.pole1.mesh.material.needUpdate = true;

        this.pole2 = new Mesh(polegeometry, polematerial)
        this.pole2.mesh.position.set(-500, 50, -1000)
        this.pole2.mesh.material.needUpdate = true;

        this.pole3 = new Mesh(polegeometry, polematerial)
        this.pole3.mesh.position.set(-500, 50, 1000)
        this.pole3.mesh.material.needUpdate = true;

        this.pole4 = new Mesh(polegeometry, polematerial)
        this.pole4.mesh.position.set(500, 50, 1000)
        this.pole4.mesh.material.needUpdate = true;

        // creting top part
        var geometry = new THREE.BoxGeometry(1000, 10, 2000);
        var texture = THREE.ImageUtils.loadTexture( "img/platform_base.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        var material = new THREE.MeshPhongMaterial({
            ambient: 0xffffff,
            color: 0x777777,
            specular: 0x555555,
            shininess: 30,
            map: texture,
        });

        this.top = new Mesh(geometry, material)
        this.top.mesh.position.y = 200

        // creating walls
        this.walls = []
        var texture = THREE.ImageUtils.loadTexture( "img/platform_wall.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(17, 5);

        var material = new THREE.MeshPhongMaterial({
            ambient: 0xffffff,
            color: 0xfde3a7,
            specular: 0x555555,
            shininess: 30,
            map: texture,
        });
        var geometry = new THREE.BoxGeometry(10, 100, 2200);

        this.walls.push(new Mesh(geometry, material))
        this.walls[0].mesh.position.set(-500, 0, 0)
        this.walls.push(new Mesh(geometry, material))
        this.walls[1].mesh.position.set(500, 0, 0)

        var geometry = new THREE.BoxGeometry(1200, 100, 10);

        this.walls.push(new Mesh(geometry, material))
        this.walls[2].mesh.position.set(0, 0, -1000)
        this.walls.push(new Mesh(geometry, material))
        this.walls[3].mesh.position.set(0, 0, 1000)

        // this need to be empty
        this.obstacles = [];

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
            var material = new THREE.MeshPhongMaterial({
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
            // adding obstacle to array, for mesh collisions
            this.obstacles.push(o.mesh)
        }
    }
});