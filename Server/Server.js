// ================== HOW TO USE THIS MIGHTY SERVER ===================
// Call:
// "node server.js -p [port] -k [key1] [key2] -r [replayFilename]"
//
// If no argument given, gameID will be 0, port will be 3011
// ====================================================================


// Get the listening port from argurment
var listeningPort = 3011;
var key1 = 0;
var key2 = 0;
var replayFilename = null;
for (var i=0; i<process.argv.length; i++) {
	if (process.argv[i] == "-p") {
		listeningPort = process.argv[i + 1];
	}
	else if (process.argv[i] == "-k") {
		key1 = process.argv[i + 1];
		key2 = process.argv[i + 2];
	}
	else if (process.argv[i] == "-r") {
		replayFilename = process.argv[i + 1];
	}
}

if (listeningPort == null || listeningPort == 0) {
	listeningPort = 3011;
}

if (key1 == null) key1 = 0;
if (key2 == null) key2 = 0;








var SOCKET_STATUS_ONLINE = 1;
var SOCKET_STATUS_OFFLINE = 0;

var socketList = new Array();
var socketStatus = new Array();




var Game = require("./Game");
var WS = require("./../NodeWS");
var Network = require("./Network");

var game = new Game(key1, key2, replayFilename);

var server = WS.createServer(function (socket) {
	// Detect to see if this socket have already connected before
	for (var i=0; i<socketList.length; i++) {
		if (socketList[i] == socket) {	
			socketStatus[i] = SOCKET_STATUS_ONLINE;
			console.log ("Returned client connected.");
			return;
		}
	}
	
	// This socket is new
	var index = socketList.length;
	socketList[index] = socket;
	socketStatus[index] = SOCKET_STATUS_ONLINE;
	socket.index = index;
	
	console.log ("New socket connected.");
	
	// Receive a text
    socket.on("text", function (data) {
		// console.log ("Data received: " + Network.PacketToString(data));
		
		game.OnCommand (socket.index, data);
    });
	
	// This socket disconnected
    socket.on("close", function (code, reason) {
		console.log ("Socket closed :" + code + " / " + reason);
        for (var i=0; i<socketList.length; i++) {
			if (socketList[i] == socket) {
				socketStatus[i] = SOCKET_STATUS_OFFLINE;
			}
		}
    });
	
	// Error is treated same as disconnected
	socket.on("error", function (code, reason) {
		console.log ("Socket error :" + code + " / " + reason);
        for (var i=0; i<socketList.length; i++) {
			if (socketList[i] == socket) {
				socketStatus[i] = SOCKET_STATUS_OFFLINE;
			}
		}
    });
}).listen(listeningPort);

game.SetServerInstance (server);

server.Send = function (playerIndex, data) {
	//console.log ("Server send to player: " + playerIndex + " with data: " + Network.PacketToString(data));
	if (socketStatus[playerIndex] == SOCKET_STATUS_ONLINE) {
		socketList[playerIndex].sendText(data);
	}
}

server.Broadcast = function (data) {
	//console.log ("Server broadcast: " + Network.PacketToString(data));
	for (var i=0; i<socketList.length; i++) {
		if (socketStatus[i] == SOCKET_STATUS_ONLINE) {
			socketList[i].sendText(data);
		}
	}
}

server.CloseServer = function () {
	console.log ("Server will close!");
	for (var i=0; i<socketList.length; i++) {
		if (socketStatus[i] == SOCKET_STATUS_ONLINE) {
			socketList[i].close (1000, "Game end!");
		}
	}
	process.exit(0);
}
	
	
console.log ("Server start successfully");