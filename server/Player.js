var Player = function(startx, starty, startz, socket) {
    var x = startx,
        y = starty,
        z = startz,
        socket = socket;

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

    return {
        getX: getX,
        getY: getY,
        getZ: getZ,
        getHealth: getHealth,
        setX: setX,
        setY: setY,
        setZ: setZ,
        setHealth: setHealth,
        id: id
    }
};

exports.Player = Player;