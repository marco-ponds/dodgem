Game.script("cameraScript", {

	start : function() {
		this.old_position = this.object.parent.parent.position.clone();
	},

	update : function() {
		//this.object.position.x += ( app.mouseX/2 - this.object.position.x ) * 0.01;
		//this.object.position.y += ( - app.mouseY - this.object.position.y ) * 0.05;
		//blocking camera 
		// getting yawobject of fps camera
		if (this.object.parent.parent.position.x > app.platform.MAX_X) {
			this.object.parent.parent.position.x = app.platform.MAX_X
		}
		if (this.object.parent.parent.position.x < app.platform.MINUS_MAX_X) {
			this.object.parent.parent.position.x = app.platform.MINUS_MAX_X
		}
		if (this.object.parent.parent.position.z > app.platform.MAX_Z) {
			this.object.parent.parent.position.z = app.platform.MAX_Z
		}
		if (this.object.parent.parent.position.z < app.platform.MINUS_MAX_Z) {
			this.object.parent.parent.position.z = app.platform.MINUS_MAX_Z
		}

		// check if we're colliding with obstacles
		var hit = false;
		for (var i=0; i<app.platform.obstacles.length; i++) {
			var o = app.platform.obstacles[i]
			o.geometry.computeBoundingBox();
			if (this.object.parent.parent.position.distanceTo(o.position) < o.mindistance) {
			//if (o.geometry.boundingBox.containsPoint(new THREE.Vector3(old_position.x*1.3, old_position.y*1.3, old_position.z*1.3))) {
					this.object.parent.parent.position.x = this.old_position.x
					this.object.parent.parent.position.y = this.old_position.y
					this.object.parent.parent.position.z = this.old_position.z
					hit = true;
			//}
			} else {
				hit = false;
			}
		}
		if (!hit) {
			this.old_position = this.object.parent.parent.position.clone();
		}

		// sending movement via socket
		var rotation = this.object.getWorldRotation();
		app.socket.emit("move player", {
			x: this.object.parent.parent.position.x,
			y: this.object.parent.parent.position.y,
			z: this.object.parent.parent.position.z,
			rotx: rotation._x,
			roty: rotation._y,
			rotz: rotation._z
		});
	}

});