var Enum = require("./Enum");

// ====================================================================================================
// System

//exports.CONNECTION_TIMEOUT = 5000; // <= These are values for real server
//exports.PICK_TANK_TIMEOUT = 5000;
exports.CONNECTION_TIMEOUT = 999999; // On local server, we should increase this, for testing purpose
exports.PICK_TANK_TIMEOUT = 999999;
// ====================================================================================================

// ====================================================================================================
// Tank 
var TANK_HP = new Array();
var TANK_SPEED = new Array(); // Move per loop
var TANK_DAMAGE = new Array(); // Damage per shot
var TANK_ROF = new Array(); // lower is better: number of loop for a tank to be able to shoot again
var BULLET_SPEED = new Array();

TANK_HP [Enum.TANK_LIGHT] = 80;
TANK_SPEED [Enum.TANK_LIGHT] = 0.5;
TANK_DAMAGE [Enum.TANK_LIGHT] = 50;
TANK_ROF [Enum.TANK_LIGHT] = 20; // DPS = Dam * 10 / Cooldown = 50 * 10 / 20 = 25;
BULLET_SPEED [Enum.TANK_LIGHT] = 1.2;

TANK_HP [Enum.TANK_MEDIUM] = 110;
TANK_SPEED [Enum.TANK_MEDIUM] = 0.25;
TANK_DAMAGE [Enum.TANK_MEDIUM] = 40;
TANK_ROF [Enum.TANK_MEDIUM] = 10; // DPS = Dam * 10 / Cooldown = 40 * 10 / 10 = 40;
BULLET_SPEED [Enum.TANK_MEDIUM] = 1;

TANK_HP [Enum.TANK_HEAVY] = 170;
TANK_SPEED [Enum.TANK_HEAVY] = 0.2;
TANK_DAMAGE [Enum.TANK_HEAVY] = 7;
TANK_ROF [Enum.TANK_HEAVY] = 2; // DPS = Dam * 10 / Cooldown = 7 * 10 / 2 = 35;
BULLET_SPEED [Enum.TANK_HEAVY] = 0.8;

exports.TANK_HP = TANK_HP;
exports.TANK_SPEED = TANK_SPEED;
exports.TANK_DAMAGE = TANK_DAMAGE;
exports.TANK_ROF = TANK_ROF;
exports.BULLET_SPEED = BULLET_SPEED;
// ====================================================================================================





// ====================================================================================================
// Other stuff
exports.NUMBER_OF_TANK = 4;
exports.OBSTACLE_HP = 100;

// Map data 22x22, each block have the enum BLOCK_ in Enum.js
exports.MAP_W = 22;
exports.MAP_H = 22;
exports.MAP = [
	2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
	2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
	2, 0, 2, 2, 2, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 2, 2, 2, 0, 2,
	2, 0, 2, 4, 4, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 4, 4, 2, 0, 2,
	2, 0, 2, 4, 4, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 4, 4, 2, 0, 2,
	2, 0, 0, 0, 0, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 0, 0, 0, 2,
	2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
	2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
	2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2,
	2, 3, 3, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 3, 3, 2,
	2, 4, 4, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 4, 4, 2,
	2, 4, 4, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 4, 4, 2,
	2, 3, 3, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 3, 3, 2,
	2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2,
	2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
	2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
	2, 0, 0, 0, 0, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 0, 0, 0, 2,
	2, 0, 2, 4, 4, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 4, 4, 2, 0, 2,
	2, 0, 2, 4, 4, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 4, 4, 2, 0, 2,
	2, 0, 2, 2, 2, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 2, 2, 2, 0, 2,
	2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
	2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
];

//Bases
exports.BASE_POSITION_1 = [[1.5, 10.5], [3.5, 3.5], [3.5, 17.5]];
exports.BASE_POSITION_2 = [[19.5, 10.5], [17.5, 3.5], [17.5, 17.5]];
exports.BASE_SIZE 		= 2;

var BASE_HP = new Array();
BASE_HP[Enum.BASE_MAIN] = 400;
BASE_HP[Enum.BASE_SIDE] = 200;
exports.BASE_HP = BASE_HP;

//Time configs
exports.TIME_UPDATE_INTERVAL 	= 100; //millisecond
exports.POWERUP_INTERVAL		= 30000  / exports.TIME_UPDATE_INTERVAL;
exports.LOOPS_SUDDEN_DEATH 		= 120000 / exports.TIME_UPDATE_INTERVAL; //count the loops in 2 minutes (2*60*1000)
exports.LOOPS_MATCH_END			= 150000 / exports.TIME_UPDATE_INTERVAL; //count the loops in 2m30s

exports.POWERUP_SPAWN_POINT     = [[10.5, 1.5], [10.5, 10.5], [10.5, 19.5]];

var POWERUP_DELAY = new Array();
POWERUP_DELAY[Enum.POWERUP_AIRSTRIKE] 	= 10;
POWERUP_DELAY[Enum.POWERUP_EMP] 		= 10;
exports.POWERUP_DELAY = POWERUP_DELAY;

exports.AIRSTRIKE_DAMAGE = 60;
exports.AIRSTRIKE_AOE = 3;
exports.EMP_DURATION = 40;
exports.EMP_AOE = 3;
// ====================================================================================================