/********************************************************************************
	MAIN SCRIPT
	copyright© 2014 Marco Stagni. http://marcostagni.com
********************************************************************************/

// https://raw.githubusercontent.com/IceCreamYou/Nemesis/master/main.js

include([
	"app/scripts/cube/mybox",
	"app/scripts/camera/cameraScript",
	"app/Platform"
]);

Class("Dodgem", {

	Dodgem: function() {
		App.call(this);
		// we now should connect to server
		this.socket = io("http://marcostagni.com:8080");
		// setting socket listeners
		this.socket.on("shooting", app.onShooting);
		this.socket.on("move", app.onMove);
		this.socket.on("pending", app.onPending);
		this.socket.on("matchstarted", app.onMatchStarted);
		this.socket.on("goneplayer", app.onGonePlayer);
	},

	onCreate: function() {

		app.socket.emit("new player", {x: 0, y: 0, z: 0});
		// setting fps control
		Control.set("fps")
		Control.options.fps.height = 2
		Control.options.fps.velocity = 1
		Control.options.fps.delta = 100
		Control.options.fps.jumpHeight = 1
		Control.options.fps.fallFactor = 3

		// adding light
		this.ambientLight = new THREE.AmbientLight(0x555555);
		app.scene.add(this.ambientLight);

		// creating platform
		this.platform = new Platform();

		app.camera.object.position.set(0, 25, 0);
		app.camera.addScript("cameraScript", "camera");

		// creating a simple skybox
		var geometry = new THREE.SphereGeometry(5000, 32, 32 );
		var material = new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture("img/starfield.png"),
			side: THREE.BackSide
		});
		this.skybox = new Mesh(geometry, material)
		
		// creating guns and attaching to the camera
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

        var gungeometry = new THREE.BoxGeometry(0.2, 0.2, 3);
		this.guns = []
        this.guns.push(new THREE.Mesh(gungeometry, gunmaterial))
        app.camera.object.add(this.guns[0])
        this.guns[0].position.set(1, 0, -2)
        this.guns[0].rotation.set(0, Math.PI/35, 0)

        this.guns.push(new THREE.Mesh(gungeometry, gunmaterial))
        app.camera.object.add(this.guns[1])
        this.guns[1].position.set(-1, 0, -2)
        this.guns[1].rotation.set(0, -Math.PI/35, 0)

        // adding mouse down event to app
        document.addEventListener("mousedown", app.onMouseDown)

        // bullet properties
        app.bulletmat = new THREE.MeshPhongMaterial({
        	color: 0x22A7F0,
        	ambient: 0xffffff,
            specular: 0x555555,
            shininess: 30
        });
		app.bulletgeo = new THREE.SphereGeometry(4, 6, 6);
		app.bullets = []
		app.raycaster = new THREE.Raycaster()
		app.whichgun = true;
	},

	// this should allow us to shoot from our guns
	onMouseDown: function(event) {
		if (event.which == 1) {
			// shoot to enemy
			app.shoot(app.whichgun);
			app.whichgun = !app.whichgun;
		}
	},

	// SOCKET EVENTS

	onMatchStarted: function(data) {
		alert(data.message);
		include("app/Player", function() {
			app.opponent = new Player();
		});
	},

	onGonePlayer: function(data) {
		alert(data.message);
	},

	onPending: function(data) {
		alert(data.message);
	},

	onShooting: function(data) {

	},

	onMove: function(data) {
		// opponent is moving
		app.opponent.body.mesh.position.set(data.x, data.y, data.z)
		app.opponent.body.mesh.rotation.set(data.rotx, data.roty, data.rotz);
	},

	shoot: function(flag) {

		// shooting from left or right gun
		inc_x = 12;
		if (flag) {
			inc_x = -12;
		}

		var cameradirection = Control.handler.getDirection(new THREE.Vector3(0, 0, 0)).clone()
		var gunposition = Control.handler.getObject().position.clone();
		var gunrotation = Control.handler.getObject().rotation.clone();
		gunposition.x += inc_x;
		app.raycaster.set(gunposition, cameradirection)

		var sphere = new Mesh(app.bulletgeo, app.bulletmat);
		sphere.mesh.position.set(gunposition.x, gunposition.y, gunposition.z) //app.raycaster.ray.origin.clone();

		//sphere.mesh.rotation.set(gunrotation.x, gunrotation.y, gunrotation.z)
		sphere.mesh.position.y += 25;
		sphere.mesh.pointing = app.raycaster.ray.direction.normalize().clone();

		sphere.mesh.shotby = "me";

		app.bullets.push(sphere.mesh);

		new Sound("shot", {mesh: Control.handler.getObject()}).start();

		// emitting shooting event

		return sphere;
	}

})._extends("App");

Game.BULLET_SPEED = 2000
Game.BULLET_DAMAGE = 100

Game.update = function() {
	// Update bullets. Walk backwards through the list so we can remove items.
	app.bullets = app.bullets || [];
	var speed = app.clock.getDelta() * Game.BULLET_SPEED;
	for (var i = app.bullets.length-1; i >= 0; i--) {
		var b = app.bullets[i], p = b.position, d = b.pointing;//ray.direction;
		if (!checkInsideArena(p)) {
			app.bullets.splice(i, 1);
			app.scene.remove(b);
			continue;
		}
		// managing collisions
		var hit = false;
		// Collide with obstacle
		for (var j = app.platform.obstacles.length-1; j >= 0; j--) {
			var a = app.platform.obstacles[j];
			var v = a.geometry.vertices[0];
			var c = a.position;
			var x = Math.abs(v.x), z = Math.abs(v.z), y = Math.abs(v.y)
			if (p.x < c.x + x && p.x > c.x - x &&
					p.z < c.z + z && p.z > c.z - z &&
					p.y < c.y + y && p.y > c.y - y) {
				app.bullets.splice(i, 1);
				app.scene.remove(b);
				a.health -= Game.BULLET_DAMAGE;
				var color = a.material.color, percent = a.health / 3000;
				a.material.color.setRGB(
						percent * color.r + 0.4,
						percent * color.g + 0.4,
						percent * color.b + 0.4
				);
				if (a.health == 1500) {
					a.material.map = app.platform.cracked_texture;
				}
				if (a.health < 0) {
					app.scene.remove(a);
					app.platform.obstacles.splice(j, 1);
				}
				hit = true;
				break;
			}
		}
		// Bullet hits player
		if (b.shotby != "me") {
			if (distance(p.x, p.z, app.camera.object.position.x, app.camera.object.position.z) < 25 && b.owner != app.camera.object) {
				/*$('#hurt').fadeIn(75);
				health -= 10;
				if (health < 0) health = 0;
				val = health < 25 ? '<span style="color: darkRed">' + health + '</span>' : health;
				$('#health').html(val);
				$('#hurt').fadeOut(350);*/
				console.log("HIT");
				app.bullets.splice(i, 1);
				app.scene.remove(b);
			}
		}
		if (!hit) {
			b.translateX(speed * d.x);
			b.translateY(speed * d.y);//b.ray.direction.y)
			b.translateZ(speed * d.z);
		}
	}
}

// calculating distance
function distance(x1, y1, x2, y2) {
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

function checkInsideArena(position) {
	if ((position.x < app.platform.MAX_X) && (position.x > app.platform.MINUS_MAX_X)) {
		if ((position.z < app.platform.MAX_Z) && (position.z > app.platform.MINUS_MAX_Z)) {
			if ((position.y > 0) && (position.y < 200)) {
				return true;
			}
			return false;
		}
		return false;
	}
	return false;
}
