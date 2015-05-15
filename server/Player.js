var Player = function(startx, starty, startz, socket) {
    var x = startx,
        y = starty,
        z = startz,
        socket = socket,
        rotx,
        roty,
        rotz,
        id;

    // getters

    var getX = function() {
        return x;
    }

    var getY = function() {
        return y;
    }

    var getZ = function() {
        return z;
    }

    var getSocket = function() {
        return socket;
    }

    var getRotX = function() {
        return rotx;
    }

    var getRotY = function() {
        return roty;
    }

    var getRotZ = function() {
        return rotz;
    }

    // setters

    var setX = function(value) {
        x = value;
    }

    var setY = function(value) {
        y = value;
    }

    var setZ = function(value) {
        z = value;
    }
    
    var setSocket = function(socket) {
        socket = socket;
    }

    var setRotX = function(value) {
        rotx = value;
    }

    var setRotY = function(value) {
        roty = value;
    }

    var setRotZ = function(value) {
        rotz = value;
    }

    return {
        getX: getX,
        getY: getY,
        getZ: getZ,
        getRotX: getRotX,
        getRotY: getRotY,
        getRotZ: getRotZ,
        getSocket: getSocket,
        setX: setX,
        setY: setY,
        setZ: setZ,
        setRotX: setRotX,
        setRotY: setRotY,
        setRotZ: setRotZ,
        setSocket: setSocket,
        id: id
    }
};

exports.Player = Player;