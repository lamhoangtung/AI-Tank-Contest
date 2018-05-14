#pragma once

#define MAP_W						22
#define MAP_H						22

#define NUMBER_OF_TANK				4

/////////////////////////////
//       GAME STATES       //
/////////////////////////////
#define STATE_WAITING_FOR_PLAYERS	0
#define STATE_TANK_PLACEMENT		1
#define STATE_ACTION				2
#define STATE_SUDDEN_DEATH			3
#define STATE_FINISHED				4

/////////////////////////////
//         PLAYERS         //
/////////////////////////////
#define TEAM_1						1
#define TEAM_2						2

/////////////////////////////
//         BLOCKS          //
/////////////////////////////
#define BLOCK_OUT_OF_BOARD			-1
#define BLOCK_GROUND				0
#define BLOCK_WATER					1
#define BLOCK_HARD_OBSTACLE			2
#define BLOCK_SOFT_OBSTACLE			3
#define BLOCK_BASE					4

/////////////////////////////
//        BASE TYPE        //
/////////////////////////////
#define BASE_MAIN					1
#define BASE_SIDE					2

/////////////////////////////
//          TANKS          //
/////////////////////////////
#define TANK_LIGHT					1
#define TANK_MEDIUM					2
#define TANK_HEAVY					3

/////////////////////////////
//          MOVES          //
/////////////////////////////
#define DIRECTION_NONE				0
#define DIRECTION_UP				1
#define DIRECTION_RIGHT				2
#define DIRECTION_DOWN				3
#define DIRECTION_LEFT				4

/////////////////////////////
//         COMMANDS        //
/////////////////////////////
#define COMMAND_PING				0
#define COMMAND_SEND_KEY			1
#define COMMAND_SEND_TEAM			2
#define COMMAND_UPDATE_STATE		3
#define COMMAND_UPDATE_MAP			4
#define COMMAND_UPDATE_TANK			5
#define COMMAND_UPDATE_BULLET		6
#define COMMAND_UPDATE_OBSTACLE		7
#define COMMAND_UPDATE_BASE			8
#define COMMAND_REQUEST_CONTROL		9
#define COMMAND_CONTROL_PLACE		10
#define COMMAND_CONTROL_UPDATE		11
#define COMMAND_UPDATE_POWERUP		12
#define COMMAND_MATCH_RESULT		13
#define COMMAND_UPDATE_INVENTORY	14
#define COMMAND_UPDATE_TIME			15
#define COMMAND_CONTROL_USE_POWERUP	16
#define COMMAND_UPDATE_STRIKE		17

/////////////////////////////
//      MATCH RESULT       //
/////////////////////////////
#define MATCH_RESULT_NOT_FINISH		0
#define MATCH_RESULT_TEAM_1_WIN		1
#define MATCH_RESULT_TEAM_2_WIN		2
#define MATCH_RESULT_DRAW			3
#define MATCH_RESULT_BAD_DRAW		4

/////////////////////////////
//       POWER-UPS         //
/////////////////////////////
#define POWERUP_AIRSTRIKE			1
#define POWERUP_EMP					2

/////////////////////////////
//      OBJECT SIZES       //
/////////////////////////////
#define TANK_SIZE					1
#define BASE_SIZE					2

/// Convert coordinate (x,y) of a 2-dimension array into index in 1-dimension array.
/// @param x specify the horizontal offset, range in [0,MAP_W-1]
/// @param y specify the vertical offset, range in [0,MAP_H-1]
#define CONVERT_COORD(x,y)	((y) * MAP_W + (x))