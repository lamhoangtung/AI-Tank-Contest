// ========================================================
// Tank
exports.TEAM_1 = 1;
exports.TEAM_2 = 2;

exports.TANK_LIGHT = 1;
exports.TANK_MEDIUM = 2;
exports.TANK_HEAVY = 3;

exports.DIRECTION_UP = 1;
exports.DIRECTION_RIGHT = 2;
exports.DIRECTION_DOWN = 3;
exports.DIRECTION_LEFT = 4;
// ========================================================




// ========================================================
// Maps
exports.BLOCK_GROUND = 0;
exports.BLOCK_WATER = 1;
exports.BLOCK_HARD_OBSTACLE = 2;
exports.BLOCK_SOFT_OBSTACLE = 3;
exports.BLOCK_BASE = 4;
// ========================================================




// ========================================================
// Bases
exports.BASE_MAIN = 1;
exports.BASE_SIDE = 2;
// ========================================================




// ========================================================
// State
exports.STATE_WAITING_FOR_PLAYERS = 0;
exports.STATE_TANK_PLACEMENT = 1;
exports.STATE_ACTION = 2;
exports.STATE_SUDDEN_DEATH = 3;
exports.STATE_FINISHED = 4;
// ========================================================





// ========================================================
// Match result
exports.MATCH_RESULT_NOT_FINISH = 0;
exports.MATCH_RESULT_TEAM_1_WIN = 1;
exports.MATCH_RESULT_TEAM_2_WIN = 2;
exports.MATCH_RESULT_DRAW = 3;
exports.MATCH_RESULT_BAD_DRAW = 4;

// ========================================================




// ========================================================
// Command
exports.COMMAND_PING = 0;
exports.COMMAND_SEND_KEY = 1;
exports.COMMAND_SEND_TEAM = 2;
exports.COMMAND_UPDATE_STATE = 3;
exports.COMMAND_UPDATE_MAP = 4;
exports.COMMAND_UPDATE_TANK = 5;
exports.COMMAND_UPDATE_BULLET = 6;
exports.COMMAND_UPDATE_OBSTACLE = 7;
exports.COMMAND_UPDATE_BASE = 8;
exports.COMMAND_REQUEST_CONTROL = 9;
exports.COMMAND_CONTROL_PLACE = 10;
exports.COMMAND_CONTROL_UPDATE = 11;
exports.COMMAND_UPDATE_POWERUP = 12;
exports.COMMAND_MATCH_RESULT = 13;
exports.COMMAND_UPDATE_INVENTORY = 14;
exports.COMMAND_UPDATE_TIME = 15;
exports.COMMAND_CONTROL_USE_POWERUP = 16;
exports.COMMAND_UPDATE_STRIKE = 17;
// ========================================================




// ========================================================
// Power up
exports.POWERUP_AIRSTRIKE = 1;
exports.POWERUP_EMP = 2;
// ========================================================