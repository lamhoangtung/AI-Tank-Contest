// ====================================================================================
//                                  HOW TO RUN THIS
// ====================================================================================
// Call:
// "node Client.js -h [host] -p [port] -k [key] -l [logFilename]"
//
// If no argument given, it'll be 127.0.0.1:3011
// key is a secret string that authenticate the bot identity
// it is not required when testing
// ====================================================================================



// ====================================================================================
//       THE CONSTANT. YOU'RE GONNA NEED THIS. MARK THIS FOR LATER REFERENCE
// ====================================================================================
var STATE_WAITING_FOR_PLAYERS = 0;
var STATE_TANK_PLACEMENT = 1;
var STATE_ACTION = 2;
var STATE_SUDDEN_DEATH = 3;
var STATE_FINISHED = 4;

var TEAM_1 = 1;
var TEAM_2 = 2;

var MAP_W = 22;
var MAP_H = 22;

var BLOCK_GROUND = 0;
var BLOCK_WATER = 1;
var BLOCK_HARD_OBSTACLE = 2;
var BLOCK_SOFT_OBSTACLE = 3;
var BLOCK_BASE = 4;

var TANK_LIGHT = 1;
var TANK_MEDIUM = 2;
var TANK_HEAVY = 3;

var DIRECTION_UP = 1;
var DIRECTION_RIGHT = 2;
var DIRECTION_DOWN = 3;
var DIRECTION_LEFT = 4;

var NUMBER_OF_TANK = 4;

var BASE_MAIN = 1;
var BASE_SIDE = 2;


var MATCH_RESULT_NOT_FINISH = 0;
var MATCH_RESULT_TEAM_1_WIN = 1;
var MATCH_RESULT_TEAM_2_WIN = 2;
var MATCH_RESULT_DRAW = 3;
var MATCH_RESULT_BAD_DRAW = 4;

var POWERUP_AIRSTRIKE = 1;
var POWERUP_EMP = 2;

//object sizes
var TANK_SIZE = 1;
var BASE_SIZE = 2;

// ====================================================================================
//                        BEHIND THE SCENE. YOU CAN SAFELY SKIP THIS
//                  Note: Don't try to modify this. It can ruin your life.
// ====================================================================================

// =============================================
// Get the host and port from argurment
// =============================================

// Logger
var Logger;
try {
	Logger = require("./NodeWS/Logger");
}
catch (e) {
	Logger = require("./../NodeWS/Logger");
}
var logger = new Logger();

var host = "127.0.0.1";
var port = 3011;
var key = 0;

for (var i=0; i<process.argv.length; i++) {
	if (process.argv[i] == "-h") {
		host = process.argv[i + 1];
	}
	else if (process.argv[i] == "-p") {
		port = process.argv[i + 1];
	}
	else if (process.argv[i] == "-k") {
		key = process.argv[i + 1];
	}
	else if (process.argv[i] == "-l") {
		logger.startLogfile(process.argv[i + 1]);
	}
}
if (host == null) host = "127.0.0.1";
if (port == null) port = 3011;
if (key == null) key = 0;

// =============================================
// Some helping function
// =============================================
var EncodeInt8 = function (number) {
	var arr = new Int8Array(1);
	arr[0] = number;
	return String.fromCharCode(arr[0]);
};
var EncodeInt16 = function (number) {
	var arr = new Int16Array(1);
	var char = new Int8Array(arr.buffer);
	arr[0] = number;
	return String.fromCharCode(char[0], char[1]);
};
var EncodeUInt8 = function (number) {
	var arr = new Uint8Array(1);
	arr[0] = number;
	return String.fromCharCode(arr[0]);
};
var EncodeUInt16 = function (number) {
	var arr = new Uint16Array(1);
	var char = new Uint8Array(arr.buffer);
	arr[0] = number;
	return String.fromCharCode(char[0], char[1]);
};
var EncodeFloat32 = function (number) {
	var arr  = new Float32Array(1);
	var char = new Uint8Array(arr.buffer);
	
	arr[0] = number;
	return String.fromCharCode(char[0], char[1], char[2], char[3]);
};
var DecodeInt8 = function (string, offset) {
	var arr  = new Int8Array(1);
	var char = new Int8Array(arr.buffer);
	arr[0] = string.charCodeAt(offset);
	return char[0];
};
var DecodeInt16 = function (string, offset) {
	var arr  = new Int16Array(1);
	var char = new Int8Array(arr.buffer);
	
	for (var i=0; i<2; ++i) {
		char[i] = string.charCodeAt(offset + i);
	}
	return arr[0];
};
var DecodeUInt8 = function (string, offset) {
	return string.charCodeAt(offset);
};
var DecodeUInt16 = function (string, offset) {
	var arr  = new Uint16Array(1);
	var char = new Uint8Array(arr.buffer);
	
	for (var i=0; i<2; ++i) {
		char[i] = string.charCodeAt(offset + i);
	}
	return arr[0];
};
var DecodeFloat32 = function (string, offset) {
	var arr  = new Float32Array(1);
	var char = new Uint8Array(arr.buffer);
	
	for (var i=0; i<4; ++i) {
		char[i] = string.charCodeAt(offset + i);
	}
	return arr[0];
};

// =============================================
// Game objects
// =============================================
function Obstacle() {
	this.m_id = 0;
	this.m_x = 0;
	this.m_y = 0;
	this.m_HP = 0;
	this.m_destructible = true;
}
function Base () {
	this.m_id = 0;
	this.m_team = 0;
	this.m_type = 0;
	this.m_HP = 0;
	this.m_x = 0;
	this.m_y = 0;
}
function Tank() {
	this.m_id = 0;
	this.m_x = 0;
	this.m_y = 0;
	this.m_team = TEAM_1;
	this.m_type = TANK_LIGHT;
	this.m_HP = 0;
	this.m_direction = DIRECTION_UP;
	this.m_speed = 0;
	this.m_rateOfFire = 0;
	this.m_coolDown = 0;
	this.m_damage = 0;
	this.m_disabled = 0;
}
function Bullet() {
	this.m_id = 0;
	this.m_x = 0;
	this.m_y = 0;
	this.m_team = TEAM_1;
	this.m_type = TANK_MEDIUM;
	this.m_direction = DIRECTION_UP;
	this.m_speed = 0;
	this.m_damage = 0;
	this.m_live = false;
}
function Strike() {
	this.m_id = 0;
	this.m_x = 0;
	this.m_y = 0;
	this.m_team = TEAM_1;
	this.m_type = POWERUP_AIRSTRIKE;
	this.m_countDown = 0;
	this.m_live = false;
}
function PowerUp() {
	this.m_id = 0;
	this.m_active = 0;
	this.m_type = 0;
	this.m_x = 0;
	this.m_y = 0;
}
var g_team = -1;
var g_state = STATE_WAITING_FOR_PLAYERS;
var g_map = new Array();
var g_obstacles = new Array();
var g_hardObstacles = new Array();
var g_tanks = new Array();
	g_tanks[TEAM_1] = new Array();
	g_tanks[TEAM_2] = new Array();
var g_bullets = new Array();
	g_bullets[TEAM_1] = new Array();
	g_bullets[TEAM_2] = new Array();
var g_bases = new Array();
	g_bases[TEAM_1] = new Array();
	g_bases[TEAM_2] = new Array();
var g_powerUps = new Array();
var g_strikes = new Array();
	g_strikes[TEAM_1] = new Array();
	g_strikes[TEAM_2] = new Array();
	
var g_matchResult;
var g_inventory = new Array();
	g_inventory[TEAM_1] = new Array();
	g_inventory[TEAM_2] = new Array();

var g_timeLeft = 0;

// =============================================
// Protocol - Sending and updating
// =============================================
var WebSocket;
try {
	WebSocket = require("./NodeWS");
}
catch (e) {
	WebSocket = require("./../NodeWS");
}

var SOCKET_IDLE = 0;
var SOCKET_CONNECTING = 1;
var SOCKET_CONNECTED = 2;

var COMMAND_PING = 0;
var COMMAND_SEND_KEY = 1;
var COMMAND_SEND_TEAM = 2;
var COMMAND_UPDATE_STATE = 3;
var COMMAND_UPDATE_MAP = 4;
var COMMAND_UPDATE_TANK = 5;
var COMMAND_UPDATE_BULLET = 6;
var COMMAND_UPDATE_OBSTACLE = 7;
var COMMAND_UPDATE_BASE = 8;
var COMMAND_REQUEST_CONTROL = 9;
var COMMAND_CONTROL_PLACE = 10;
var COMMAND_CONTROL_UPDATE = 11;
var COMMAND_UPDATE_POWERUP = 12;
var COMMAND_MATCH_RESULT = 13;
var COMMAND_UPDATE_INVENTORY = 14;
var COMMAND_UPDATE_TIME = 15;
var COMMAND_CONTROL_USE_POWERUP = 16;
var COMMAND_UPDATE_STRIKE = 17;


var socket = null;
var socketStatus = SOCKET_IDLE;


socket = WebSocket.connect ("ws://" + host + ":" + port, [], function () {
	logger.print ("Socket connected");
	socketStatus = SOCKET_CONNECTED;
	SendKey();
});
socket.on("error", function (code, reason) {
	socketStatus = SOCKET_IDLE;
	logger.print ("Socket error: " + code);
});
socket.on("text", function (data) {
	OnMessage (data);
});
socketStatus = SOCKET_CONNECTING;


function Send(data) {
	//console.log ("Socket send: " + PacketToString(data));
	socket.sendText (data);
}
function OnMessage(data) {
	// console.log ("Data received: " + PacketToString(data));
	
	var readOffset = 0;
	
	while (true) {
		var command = DecodeUInt8 (data, readOffset); 
		readOffset++;
		
		if (command == COMMAND_SEND_TEAM) {
			g_team = DecodeUInt8 (data, readOffset); readOffset ++;
		}
		else if (command == COMMAND_UPDATE_STATE) {
			state = DecodeUInt8 (data, readOffset);
			readOffset++;
			
			if (g_state == STATE_WAITING_FOR_PLAYERS && state == STATE_TANK_PLACEMENT) {
				g_state = state;
				setTimeout(OnPlaceTankRequest, 100);
			}
		}
		else if (command == COMMAND_UPDATE_MAP) {
			g_hardObstacles = new Array();
			for (var i=0; i<MAP_W; i++) {
				for (var j=0; j<MAP_H; j++) {
					g_map[j * MAP_W + i] = DecodeUInt8 (data, readOffset);
					readOffset += 1;
					
					if (g_map[j * MAP_W + i] == BLOCK_HARD_OBSTACLE) {
						var temp = new Obstacle();
						temp.m_id = -1;
						temp.m_x = i;
						temp.m_y = j;
						temp.m_HP = 9999;
						temp.m_destructible = false;
						g_hardObstacles.push (temp);
					}
				}
			}
		}
		else if (command == COMMAND_UPDATE_TIME) {
			g_timeLeft = DecodeInt16 (data, readOffset); readOffset += 2;
		}
		else if (command == COMMAND_UPDATE_OBSTACLE) {
			readOffset += ProcessUpdateObstacleCommand(data, readOffset);
		}
		else if (command == COMMAND_UPDATE_TANK) {
			readOffset += ProcessUpdateTankCommand(data, readOffset);
		}
		else if (command == COMMAND_UPDATE_BULLET) {
			readOffset += ProcessUpdateBulletCommand(data, readOffset);
		}
		else if (command == COMMAND_UPDATE_BASE) {
			readOffset += ProcessUpdateBaseCommand(data, readOffset);
		}
		else if (command == COMMAND_MATCH_RESULT) {
			readOffset += ProcessMatchResultCommand(data, readOffset);
		}
		else if (command == COMMAND_UPDATE_POWERUP) {
			readOffset += ProcessUpdatePowerUpCommand(data, readOffset);
		}
		else if (command == COMMAND_UPDATE_STRIKE) {
			readOffset += ProcessUpdateStrikeCommand(data, readOffset);
		}
		else if (command == COMMAND_UPDATE_INVENTORY) {
			readOffset += ProcessUpdateInventoryCommand(data, readOffset);
		}
		else if (command == COMMAND_REQUEST_CONTROL) {
			Update();
		}		
		else {
			readOffset ++;
			logger.print ("Invalid command id: " + command)
		}
		
		if (readOffset >= data.length) {
			break;
		}
	}
}
function SendKey() {
	if (socketStatus == SOCKET_CONNECTED) {
		var packet = "";
		packet += EncodeUInt8(COMMAND_SEND_KEY);
		packet += EncodeInt8(key);
		Send (packet);
	}
}



function ProcessUpdateObstacleCommand (data, originalOffset) {
	var offset = originalOffset;
	var id = DecodeUInt8 (data, offset); offset++;
	var x = DecodeUInt8 (data, offset); offset++;
	var y = DecodeUInt8 (data, offset); offset++;
	var HP = DecodeUInt8 (data, offset); offset++;
	
	if (g_obstacles[id] == null) {
		g_obstacles[id] = new Obstacle();
	}
	g_obstacles[id].m_id = id;
	g_obstacles[id].m_x = x;
	g_obstacles[id].m_y = y;
	g_obstacles[id].m_HP = HP;
	
	if (g_obstacles[id].m_HP <= 0) {
		g_map[y * MAP_W + x] = BLOCK_GROUND;
	}
	
	return offset - originalOffset;
}

function ProcessUpdateTankCommand (data, originalOffset) {
	var offset = originalOffset;
	var id = DecodeUInt8 (data, offset); offset++;
	var team = DecodeUInt8 (data, offset); offset++;
	var type = DecodeUInt8 (data, offset); offset++;
	var HP = DecodeUInt16 (data, offset); offset+=2;
	var dir = DecodeUInt8 (data, offset); offset++;
	var speed = DecodeFloat32 (data, offset); offset+=4;
	var ROF = DecodeUInt8 (data, offset); offset++;
	var cooldown = DecodeUInt8 (data, offset); offset++;
	var damage = DecodeUInt8 (data, offset); offset++;
	var disabled = DecodeUInt8 (data, offset); offset++;
	var x = DecodeFloat32 (data, offset); offset+=4;
	var y = DecodeFloat32 (data, offset); offset+=4;
	
	if (g_tanks[team][id] == null) {
		g_tanks[team][id] = new Tank();
	}
	g_tanks[team][id].m_id = id;
	g_tanks[team][id].m_team = team;
	g_tanks[team][id].m_type = type;
	g_tanks[team][id].m_HP = HP;
	g_tanks[team][id].m_direction = dir;
	g_tanks[team][id].m_speed = speed;
	g_tanks[team][id].m_rateOfFire = ROF;
	g_tanks[team][id].m_coolDown = cooldown;
	g_tanks[team][id].m_damage = damage;
	g_tanks[team][id].m_disabled = disabled;
	g_tanks[team][id].m_x = x;
	g_tanks[team][id].m_y = y;
	
	return offset - originalOffset;
}
function ProcessUpdateBulletCommand (data, originalOffset) {
	var offset = originalOffset;
	var id = DecodeUInt8 (data, offset); offset++;
	var live = DecodeUInt8 (data, offset); offset++;
	var team = DecodeUInt8 (data, offset); offset++;
	var type = DecodeUInt8 (data, offset); offset++;
	var dir = DecodeUInt8 (data, offset); offset++;
	var speed = DecodeFloat32 (data, offset); offset+=4;
	var damage = DecodeUInt8 (data, offset); offset++;
	var hit = DecodeUInt8 (data, offset); offset++; // not used 
	var x = DecodeFloat32 (data, offset); offset+=4;
	var y = DecodeFloat32 (data, offset); offset+=4;
	
	if (g_bullets[team][id] == null) {
		g_bullets[team][id] = new Bullet();
	}
	g_bullets[team][id].m_id = id;
	g_bullets[team][id].m_live = live;
	g_bullets[team][id].m_team = team;
	g_bullets[team][id].m_type = type;
	g_bullets[team][id].m_direction = dir;
	g_bullets[team][id].m_speed = speed;
	g_bullets[team][id].m_damage = damage;
	g_bullets[team][id].m_x = x;
	g_bullets[team][id].m_y = y;
	
	return offset - originalOffset;
}

function ProcessUpdatePowerUpCommand (data, originalOffset) {
	var offset = originalOffset;
	var id = DecodeUInt8 (data, offset); offset++;
	var active = DecodeUInt8 (data, offset); offset++;
	var type = DecodeUInt8 (data, offset); offset++;
	var x = DecodeFloat32 (data, offset); offset+=4;
	var y = DecodeFloat32 (data, offset); offset+=4;
	
	if (g_powerUps[id] == null) {
		g_powerUps[id] = new PowerUp();
	}
	g_powerUps[id].m_id = id;
	g_powerUps[id].m_active = active;
	g_powerUps[id].m_type = type;
	g_powerUps[id].m_x = x;
	g_powerUps[id].m_y = y;
	
	return offset - originalOffset;	
}

function ProcessUpdateBaseCommand (data, originalOffset) {
	var offset = originalOffset;
	var id = DecodeUInt8 (data, offset); offset++;
	var team = DecodeUInt8 (data, offset); offset++;
	var type = DecodeUInt8 (data, offset); offset++;
	var HP = DecodeUInt16 (data, offset); offset+=2;
	var x = DecodeFloat32 (data, offset); offset+=4;
	var y = DecodeFloat32 (data, offset); offset+=4;
	
	if (g_bases[team][id] == null) {
		g_bases[team][id] = new Base();
	}
	g_bases[team][id].m_id = id;
	g_bases[team][id].m_team = team;
	g_bases[team][id].m_type = type;
	g_bases[team][id].m_HP = HP;
	g_bases[team][id].m_x = x;
	g_bases[team][id].m_y = y;
	
	return offset - originalOffset;
}

function ProcessUpdateInventoryCommand (data, originalOffset) {
	g_inventory[TEAM_1] = new Array();
	g_inventory[TEAM_2] = new Array();

	var offset = originalOffset;
	var number1 = DecodeUInt8 (data, offset); offset++;
	for (var i=0; i<number1; i++) {
		g_inventory[TEAM_1][i] = DecodeUInt8 (data, offset); offset++;
	}
	var number2 = DecodeUInt8 (data, offset); offset++;
	for (var i=0; i<number2; i++) {
		g_inventory[TEAM_2][i] = DecodeUInt8 (data, offset); offset++;
	}
	
	return offset - originalOffset;
}

function ProcessUpdateStrikeCommand(data, originalOffset) {
	var offset = originalOffset;
	var id = DecodeUInt8 (data, offset); 		offset++;
	var team = DecodeUInt8 (data, offset); 		offset++;
	var type = DecodeUInt8 (data, offset); 		offset++;
	var live = DecodeUInt8 (data, offset); 		offset++;
	var countDown = DecodeUInt8 (data, offset);	offset++;
	var x = DecodeFloat32 (data, offset); 		offset+=4;
	var y = DecodeFloat32 (data, offset); 		offset+=4;
	
	if (g_strikes[team][id] == null) {
		g_strikes[team][id] = new Strike();
	}
	g_strikes[team][id].m_id = id;
	g_strikes[team][id].m_live = live;
	g_strikes[team][id].m_team = team;
	g_strikes[team][id].m_type = type;
	g_strikes[team][id].m_countDown = countDown;
	g_strikes[team][id].m_x = x;
	g_strikes[team][id].m_y = y;
	
	return offset - originalOffset;
}

function ProcessMatchResultCommand(data, originalOffset) {
	var offset = originalOffset;
	g_matchResult = DecodeUInt8 (data, offset); offset++;
	g_state = STATE_FINISHED; //update state for safety, server should also send a msg update state
	
	return offset - originalOffset;
}

// An object to hold the command, waiting for process
function ClientCommand() {
	var g_direction = 0;
	var g_move = false;
	var g_shoot = false;
	var g_dirty = false;
}
var clientCommands = new Array();
for (var i=0; i<NUMBER_OF_TANK; i++) {
	clientCommands.push (new ClientCommand());
}

// Pending command as a string.
var g_commandToBeSent = "";

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
//                                    GAME RULES                                    //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
// - The game is played on a map of 20x20 blocks where [x,y] is referred as the     //
// block at column x and row y.                                                     //
// - Each team has 1 main base, 2 side bases and 4 tanks.                           //
// - At the beginning of a game, each player will choose 4 tanks and place them     //
// on the map (not on any bases/obstacles/tanks).                                   //
// - The game is played in real-time mode. Each player will control 4 tanks in      //
// order to defend their bases and at the same time, try to destroy their enemy’s   //
// bases.                                                                           //
// -Your tank bullets or cannon shells will pass other allied tank (not friendly    //
// fire), but will damage your own bases, so watch where you firing.                //
// -A destroyed tank will allow bullet to pass through it, but still not allow      //
// other tanks to pass through.                                                     //
// - When the game starts (and after each 30 seconds) , a random power-up will be   //
// spawn at 1 of 3 bridges (if there are still space) at location:                  //
// [10.5, 1.5], [10.5, 10.5], [10.5, 19.5].                                         //
// - Power-ups are friendly-fired and have area of effect (AOE) damage. All units   //
// near the struck location will be affected. Use them wisely.                      //
// - The game is over when:                                                         //
//   + The main base of 1 team is destroyed. The other team is the winner.          //
//   + If all tanks of a team are destroyed, the other team is the winner.          //
//   + After 120 seconds, if both main bases are not destroyed, the team with more  //
//   side bases remaining is the winner.                                            //
//   + If both team have the same bases remaining, the game will change to “Sudden  //
//   Death” mode. In Sudden Death mode:                                             //
//     * 2 teams will play for extra 30 seconds.                                    //
//     * All destructible obstacles are removed.                                    //
//     * If 1 team can destroy any base, they are the winner.                       //
//     * After Sudden Death mode is over, the team has more tanks remaining is the  //
//     winner.                                                                      //
//   + The time is over. If it’s an active game (i.e. Some tanks and/or bases are   // 
//   destroyed), the result is a DRAW. If nothing is destroyed, it’s a BAD_DRAW.    //
//                                                                                  //
// Please read the detailed rule on our web site at:                                //
//   http://han-ai-contest2016.gameloft.com                                         //
//////////////////////////////////////////////////////////////////////////////////////

// ====================================================================================
//                                       NOTE:
// ====================================================================================
// Do not modify the code above, you won't be able to 'hack',
// all data sent to server is double checked there.
// Further more, if you cause any damage to the server or
// wrong match result, you'll be disqualified right away.
//
// 
//
// That's pretty much about it. Now, let's start coding.
// ====================================================================================






// ====================================================================================
// COMMAND FUNCTIONS: THESE ARE FUNCTIONS THAT HELP YOU TO CONTROL YOUR LITTLE ARMY
// ====================================================================================

// You call this function inside OnPlaceTankRequest() 4 times, to pick and place your tank.
// First param is the tank you want to use: TANK_LIGHT, TANK_MEDIUM or TANK_HEAVY.
// Then the coordinate you want to place. Must be integer.
function PlaceTank(type, x, y) {
	g_commandToBeSent += EncodeUInt8(COMMAND_CONTROL_PLACE);
	g_commandToBeSent += EncodeUInt8(type);
	g_commandToBeSent += EncodeUInt8(x >> 0);
	g_commandToBeSent += EncodeUInt8(y >> 0);
}

// You call this function inside Update(). This function will help you control your tank.
// - First parameter is the id of your tank (0 to 3), in your creation order when you placed your tank
// - Second parameter is the direction you want to turn your tank into. I can be DIRECTION_UP, DIRECTION_LEFT, DIRECTION_DOWN or DIRECTION_RIGHT.
// If you leave this param null, the tank will keep on its current direction.
// - Third parameter: True / False, whether to move your tank forward, or stay till.
// - Fourth parameter: True / False, whether to use your tank's main cannon. aka. Pew pew pew! Careful about the cooldown though.
function CommandTank (id, turn, move, shoot) {
	// Save to a list of command, and send later
	// This is to prevent player to send duplicate command.
	// Duplicate command will overwrite the previous one.
	// We just send one.
	// Turn can be null, it won't change a tank direction.
	if (turn != null) {
		clientCommands[id].m_direction = turn;
	}
	else {
		clientCommands[id].m_direction = g_tanks[g_team][id].m_direction;
	}
	
	clientCommands[id].m_move = move;
	clientCommands[id].m_shoot = shoot;
	clientCommands[id].m_dirty = true;
}


// You call this function to use the Airstrike powerup on a position
// Param is coordination. Can be float or integer.
// WARNING: ALL POWERUP ARE FRIENDLY-FIRE ENABLED.
// YOUR TANK OR YOUR BASE CAN BE HARM IF IT'S INSIDE THE AOE OF THE STRIKE
function UseAirstrike(x, y) {
	if (HasAirstrike()) {
		g_commandToBeSent += EncodeUInt8(COMMAND_CONTROL_USE_POWERUP);
		g_commandToBeSent += EncodeUInt8(POWERUP_AIRSTRIKE);
		g_commandToBeSent += EncodeFloat32(x);
		g_commandToBeSent += EncodeFloat32(y);
	}
}
// Same as above, but EMP instead of Airstrike.
function UseEMP(x, y) {
	if (HasEMP()) {
		g_commandToBeSent += EncodeUInt8(COMMAND_CONTROL_USE_POWERUP);
		g_commandToBeSent += EncodeUInt8(POWERUP_EMP);
		g_commandToBeSent += EncodeFloat32(x);
		g_commandToBeSent += EncodeFloat32(y);
	}
}

// This function is called at the end of the function Update or OnPlaceTankRequest.
// I've already called it for you, don't delete it.
function SendCommand () {
	// Send all pending command
	for (var i=0; i<NUMBER_OF_TANK; i++) {
		if (clientCommands[i].m_dirty == true) {
			g_commandToBeSent += EncodeUInt8(COMMAND_CONTROL_UPDATE);
			g_commandToBeSent += EncodeUInt8(i);
			g_commandToBeSent += EncodeUInt8(clientCommands[i].m_direction);
			g_commandToBeSent += EncodeUInt8(clientCommands[i].m_move);
			g_commandToBeSent += EncodeUInt8(clientCommands[i].m_shoot);
			
			clientCommands.m_dirty = false;
		}
	}
	Send (g_commandToBeSent);
	g_commandToBeSent = "";
}

// ====================================================================================
// HELPING FUNCTIONS: THESE ARE FUNCTIONS THAT HELP YOU RETRIEVE GAME VARIABLES
// ====================================================================================
function GetTileAt(x, y) {
	// This function return landscape type of the tile block on the map
	// It'll return the following value:
	// BLOCK_GROUND
	// BLOCK_WATER
	// BLOCK_HARD_OBSTACLE
	// BLOCK_SOFT_OBSTACLE
	// BLOCK_BASE
	
	return g_map[y * MAP_W + x];
}
function GetObstacleList() {
	// Return the obstacle list, both destructible, and the non destructible
	// This does not return water type tile.
	var list = [];
	for (var i=0; i<g_obstacles.length; i++) {
		list.push (g_obstacles);
	}
	for (var i=0; i<g_hardObstacles.length; i++) {
		list.push (g_hardObstacles);
	}
	return list;
}
function GetMyTeam() {
	// This function return your current team.
	// It can be either TEAM_1 or TEAM_2
	// Obviously, your opponent is the other team.
	return g_team;
}

function GetOpponentTeam() {
	if(g_team == TEAM_1)
		return TEAM_2;
	else
		return TEAM_1;
}

function GetMyTank(id) {
	// Return your tank, just give the id.
	return g_tanks[g_team][id];
}

function GetEnemyTank(id) {
	// Return enemy tank, just give the id.
	return g_tanks[(TEAM_1 + TEAM_2) - g_team][id];
}

function GetPowerUpList() {
	// Return active powerup list
	var powerUp = [];
	for (var i=0; i<g_powerUps.length; i++) {
		if (g_powerUps[i].m_active) {
			powerUp.push (g_powerUps[i]);
		}
	}
	
	return powerUp;
}

function HasAirstrike() {
	// Call this function to see if you have airstrike powerup.
	for (var i=0; i<g_inventory[g_team].length; i++) {
		if (g_inventory[g_team][i] == POWERUP_AIRSTRIKE) {
			return true;
		}
	}
	return false;
}

function HasEMP() {
	// Call this function to see if you have EMP powerup.
	for (var i=0; i<g_inventory[g_team].length; i++) {
		if (g_inventory[g_team][i] == POWERUP_EMP) {
			return true;
		}
	}
	return false;
}

function GetIncomingStrike() {
	var incoming = [];
	
	for (var i=0; i<g_strikes[TEAM_1].length; i++) {
		if (g_strikes[TEAM_1][i].m_live) {
			incoming.push (g_strikes[TEAM_1][i]);
		}
	}
	for (var i=0; i<g_strikes[TEAM_2].length; i++) {
		if (g_strikes[TEAM_2][i].m_live) {
			incoming.push (g_strikes[TEAM_2][i]);
		}
	}
	
	return incoming;
}

// ====================================================================================
// YOUR FUNCTIONS. YOU IMPLEMENT YOUR STUFF HERE.
// ====================================================================================
function OnPlaceTankRequest() {
	// This function is called at the start of the game. You place your tank according
	// to your strategy here.
	if (GetMyTeam() == TEAM_1) {
		PlaceTank(TANK_LIGHT, 5, 2);
		PlaceTank(TANK_MEDIUM, 3, 8);
		PlaceTank(TANK_HEAVY, 6, 10);
		PlaceTank(TANK_LIGHT, 4, 14);
	}
	else if (GetMyTeam() == TEAM_2) {
		PlaceTank(TANK_LIGHT, 16, 4);
		PlaceTank(TANK_MEDIUM, 17, 8);
		PlaceTank(TANK_HEAVY, 17, 13);
		PlaceTank(TANK_HEAVY, 16, 19);
	}
	
	// Leave this here, don't remove it.
	// This command will send all of your tank command to server
	SendCommand();
}

function Update() {
	// =========================================================================================================
	// Do nothing if the match is ended
	// You should keep this. Removing it probably won't affect much, but just keep it.
	// =========================================================================================================
	if(g_state == STATE_FINISHED) {
		if(((g_matchResult == MATCH_RESULT_TEAM_1_WIN) && (GetMyTeam() == TEAM_1)) || ((g_matchResult == MATCH_RESULT_TEAM_2_WIN) && (GetMyTeam() == TEAM_2))) {
			console.log("I WON. I WON. I'M THE BEST!!!");
		}
		else if(((g_matchResult == MATCH_RESULT_TEAM_2_WIN) && (GetMyTeam() == TEAM_1)) || ((g_matchResult == MATCH_RESULT_TEAM_1_WIN) && (GetMyTeam() == TEAM_2))) {
			console.log("DAMN, I LOST. THAT GUY WAS JUST LUCKY!!!");
		}
		else {
			console.log("DRAW.. BORING!");
		}
		return;
	}
	
	
	
	
	
	
	
	
	// =========================================================================================================
	// Check if there will be any airstrike or EMP
	// The GetIncomingStrike() function will return an array of strike object. Both called by your team
	// or enemy team.
	// =========================================================================================================
	var strike = GetIncomingStrike();
	for (var i=0; i<strike.length; i++) {
		var x = strike[i].m_x;
		var y = strike[i].m_y;
		var count = strike[i].m_countDown; // Delay (in server loop) before the strike reach the battlefield.
		var type = strike[i].m_type;
		
		if (type == POWERUP_AIRSTRIKE) {
			// You may want to do something here, like moving your tank away if the strike is on top of your tank.
		}
		else if (type == POWERUP_EMP) {
			// Run... RUN!!!!
		}
	}
	
	
	
	
	
	// =========================================================================================================
	// Get power up list on the map. You may want to move your tank there and secure it before your enemy
	// does it. You can get coordination, and type from this object
	// =========================================================================================================
	var powerUp = GetPowerUpList();
	for (var i=0; i<powerUp.length; i++) {
		var x = powerUp[i].m_x;
		var y = powerUp[i].m_y;
		var type = powerUp[i].m_type;
		if (type == POWERUP_AIRSTRIKE) {
			// You may want to move your tank to this position to secure this power up.
		}
		else if (type == POWERUP_EMP) {
			
		}
	}
	
	
	
	// =========================================================================================================
	// This is an example on how you command your tanks.
	// In this example, I go through all of my "still intact" tanks, and give them random commands.
	// =========================================================================================================
	// Loop through all tank (if not dead yet)
	for (var i=0; i<NUMBER_OF_TANK; i++) {
		var tempTank = GetMyTank(i);
		// Don't waste effort if tank was dead
		if((tempTank == null) ||(tempTank.m_HP == 0))
			continue;
		
		// Run randomly and fire as soon as cooldown finish.
		// You may want a more ... intelligent algorithm here.
		if (Math.random() > 0.9) {
			var direction = (Math.random() * 4) >> 0;
			CommandTank (i, direction + 1, true, true); // Turn into the direction, keep moving, and firing like there is no tomorrow
		}
		else {
			CommandTank (i, null, true, true); // Keep the old direction, keep on moving and firing.
		}
	}
	
	
	
	
	// =========================================================================================================
	// This is an example on how you use your power up if you acquire one.
	// If you have airstrike or EMP, you may use them anytime.
	// I just give a primitive example here: I strike on the first enemy tank, as soon as I acquire power up
	// =========================================================================================================
	if (HasAirstrike()) {
		for (var i=0; i<NUMBER_OF_TANK; i++) {
			if (GetEnemyTank(i).m_HP > 0) {
				UseAirstrike (GetEnemyTank(i).m_x, GetEnemyTank(i).m_y); // BAM!!!
				break;
			}
		}
	}
	if (HasEMP()) {
		for (var i=0; i<NUMBER_OF_TANK; i++) {
			if (GetEnemyTank(i).m_HP > 0) {
				UseEMP (GetEnemyTank(i).m_x, GetEnemyTank(i).m_y);
				break;
			}
		}
	}
	
	// Leave this here, don't remove it.
	// This command will send all of your tank command to server
	SendCommand();
}