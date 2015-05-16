// server requirements
var util = require("util"),
    io = require("socket.io"),
    _ = require("underscore"),
    Player = require("./Player.js").Player;

// server variables
var socket, players, pendings, matches;


// init method
function init() {
    players = [];
    pendings = [];
    matches = {};
    // socket.io setup
    socket = io.listen(8000);
    //socket.configure(function() {
        // setting socket io transport
    socket.set("transports", ["websocket"]);
        // setting socket io log level
    socket.set("log lever", 2);
    //});
    setEventHandlers();
}

var setEventHandlers = function() {
    // Socket.IO
    socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
    util.log("New player has connected: "+client.id);

    // Listen for client disconnected
    client.on("disconnect", onClientDisconnect);

    // Listen for new player message
    client.on("new player", onNewPlayer);

    // Listen for move player message
    client.on("move player", onMovePlayer);

    // Listen for shooting player
    client.on("shooting player", onShootingPlayer);

    // Listen for died player
    client.on("Idied", onDeadPlayer);

    // Listen for another match message
    client.on("anothermatch", onAnotherMatchRequested);
};

// Socket client has disconnected
function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);

    var removePlayer = playerById(this.id);

    // Player not found
    if (!removePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    var opponentId = matches[this.id];
    if (!opponentId) {
        util.log("No match found!");

        // remove match ( it should be already undefined ..)
        matches[this.id] = undefined;

        // Remove player from players array
        players.splice(players.indexOf(removePlayer), 1);
        pendings = _.without(pendings, removePlayer.id);
        return;
    }

    // sending data to opponent
    playerById(opponentId).getSocket().emit("goneplayer", {status: "gone player", message: "Your opponent is no longer online"});
    
    // remove match
    id = matches[this.id];
    matches[id] = undefined;
    matches[this.id] = undefined;

    // Remove player from players array
    players.splice(players.indexOf(removePlayer), 1);
    pendings = _.without(pendings, removePlayer.id);

    // opponent player gets back to pending status
    pendings.push(opponentId);
};

// New player has joined
function onNewPlayer(data) {
    // Create a new player
    var newPlayer = new Player(data.x, data.y, data.z, this);
    newPlayer.id = this.id;

    console.log("creating new player");
    // Add new player to the players array
    players.push(newPlayer);

    // searching for a pending player
    var id = _.sample(pendings);
    if (!id) {
        // we didn't find a player
        console.log("added " + this.id + " to pending");
        pendings.push(newPlayer.id);
        // sending a pending event to player
        newPlayer.getSocket().emit("pending", {status: "pending", message: "waiting for a new player."});
    } else {
        // creating match
        pendings = _.without(pendings, id);
        matches[id] = newPlayer.id;
        matches[newPlayer.id] = id;

        // sending both player info that they're connected
        newPlayer.getSocket().emit("matchstarted", {status: "matchstarted", message: "Player found!"});
        playerById(id).getSocket().emit("matchstarted", {status: "matchstarted", message: "Player found!"});
    }
};

// Player has died
function onDeadPlayer(data) {
    // Find player in array
    var deadPlayer = playerById(this.id);

    // Player not found
    if (!deadPlayer) {
        //util.log("Player not found: "+this.id);
        return;
    };

    // searching for matched player, and sending data
    var opponentId = matches[this.id];
    if (!opponentId) {
        //util.log("No match found!");
        return;
    }

    // the other player has win!
    playerById(opponentId).emit("win");
}

// Player has requested another match
function onAnotherMatchRequested(data) {
    // Find player in array
    var requestingPlayer = playerById(this.id);

    // Player not found
    if (!requestingPlayer) {
        //util.log("Player not found: "+this.id);
        return;
    };

    // searching for a pending player
    var id = _.sample(pendings);
    if (!id) {
        // we didn't find a player
        console.log("added " + this.id + " to pending");
        pendings.push(requestingPlayer.id);
        // sending a pending event to player
        requestingPlayer.getSocket().emit("pending", {status: "pending", message: "waiting for a new player."});
    } else {
        // creating match
        pendings = _.without(pendings, id);
        matches[id] = requestingPlayer.id;
        matches[requestingPlayer.id] = id;

        // generating world for this match
        var numObstacles = _.random(10, 30);
        var height = _.random(70, 100);
        var MAX_X = 490
        var MINUS_MAX_X = -490
        var MAX_Z = 990
        var MINUS_MAX_Z = -990
        var positions = [];
        for (var i=0; i<numObstacles; i++) {
            positions.push({
                x: _.random(MINUS_MAX_X, MAX_X),
                z: _.random(MINUS_MAX_Z, MAX_Z) 
            });
        }
        // sending both player info that they're connected
        requestingPlayer.getSocket().emit("matchstarted", {status: "matchstarted", message: "Player found!", numObstacles: numObstacles, height: height, positions: positions});
        playerById(id).getSocket().emit("matchstarted", {status: "matchstarted", message: "Player found!", numObstacles: numObstacles, height: height, positions: positions});
    }
}

// Player has moved
function onMovePlayer(data) {
    // Find player in array
    var movePlayer = playerById(this.id);

    // Player not found
    if (!movePlayer) {
        //util.log("Player not found: "+this.id);
        return;
    };

    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
    movePlayer.setZ(data.z);
    movePlayer.setRotX(data.rotx);
    movePlayer.setRotY(data.roty);
    movePlayer.setRotZ(data.rotz);

    // searching for matched player, and sending data
    var opponentId = matches[this.id];
    if (!opponentId) {
        //util.log("No match found!");
        return;
    }
    // sending data to player
    playerById(opponentId).getSocket().emit("move", {
        x: movePlayer.getX(),
        y: movePlayer.getY(),
        z: movePlayer.getZ(),
        rotx: movePlayer.getRotX(),
        roty: movePlayer.getRotY(),
        rotz: movePlayer.getRotZ()
    });
};

// player is shooting
function onShootingPlayer(data) {
    // Find player in array
    var shootingPlayer = playerById(this.id);

    // Player not found
    if (!shootingPlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    // searching for matched player, and sending data
    var opponentId = matches[this.id];
    if (!opponentId) {
        util.log("No match found!");
        return;
    }
    // sending data to player
    playerById(opponentId).getSocket().emit("shooting", {
        startx: data.startx,
        starty: data.starty,
        startz: data.startz,
        dirx: data.diry,
        diry: data.diry,
        dirz: data.diry
    });
}

// Find player by ID
function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };
    
    return false;
};

// initializing app
init();