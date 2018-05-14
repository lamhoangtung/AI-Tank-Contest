// ========================================================
// ========================================================
// ========================================================
// State
var STATE_WAITING_FOR_PLAYERS = 0;
var STATE_TANK_PLACEMENT = 1;
var STATE_ACTION = 2;
var STATE_SUDDEN_DEATH = 3;
var STATE_FINISHED = 4;

var PACKET_PROCESS_INTERVAL = 100;
// ========================================================
// ========================================================
// ========================================================
// Maps
var MAP_OFFSET_X = -10; // Reserved for screenshake
var MAP_OFFSET_Y = -10; // Reserved for screenshake

var MAP_WATER_FRAME_NUMBER = 30;
var MAP_WATER_FRAME_DURATION = 60;
var MAP_WATER_SPRITE_W = 6;
var MAP_WATER_ALPHA = 0.7;

var BLOCK_SIZE = 40;
var MAP_W = 22;
var MAP_H = 22;

var BLOCK_GROUND = 0;
var BLOCK_WATER = 1;
var BLOCK_HARD_OBSTACLE = 2;
var BLOCK_SOFT_OBSTACLE = 3;
// ========================================================
// ========================================================
// ========================================================
// Tank
var TEAM_1 = 1;
var TEAM_2 = 2;

var TANK_LIGHT = 1;
var TANK_MEDIUM = 2;
var TANK_HEAVY = 3;

var DIRECTION_UP = 1;
var DIRECTION_RIGHT = 2;
var DIRECTION_DOWN = 3;
var DIRECTION_LEFT = 4;
// ========================================================
// ========================================================
// ========================================================
// Base
var BASE_MAIN = 1;
var BASE_SIDE = 2;

// ========================================================
// ========================================================
// ========================================================
// Power Up
var POWERUP_AIRSTRIKE = 1;
var POWERUP_EMP = 2;

// ========================================================
// ========================================================
// ========================================================
// Explosion
var EXPLOSION_TANK = 1;
var EXPLOSION_CANNON = 2;
var EXPLOSION_OBSTACLE = 3;
var EXPLOSION_EMP = 4;
var EXPLOSION_BULLET = 5;

var EXPLOSION_CANNON_MUZZLE = 7;
var EXPLOSION_GUN_MUZZLE = 8;

// ========================================================
// ========================================================
// ========================================================
// Match result
var MATCH_RESULT_NOT_FINISH = 0;
var MATCH_RESULT_TEAM_1_WIN = 1;
var MATCH_RESULT_TEAM_2_WIN = 2;
var MATCH_RESULT_DRAW = 3;
var MATCH_RESULT_BAD_DRAW = 4;

var RESULT_BOARD_W = 550;
var RESULT_BOARD_H = 200;

var SUDDEN_DEATH_DURATION = 30;


function GSActionPhase () {
	var TIME_BOARD_X = 1030;
	var TIME_BOARD_Y = 805;
	
	var FF_BUTTON_X = 1102;
	var FF_BUTTON_Y = 767;
	var FF_BUTTON_W = 47;
	var FF_BUTTON_H = 47;
	
	var RW_BUTTON_X = 910;
	var RW_BUTTON_Y = 767;
	var RW_BUTTON_W = 47;
	var RW_BUTTON_H = 47;
	
	var TEAM_1_INVENTORY_X = 947;
	var TEAM_1_INVENTORY_Y = 278;
	
	var TEAM_2_INVENTORY_X = 947;
	var TEAM_2_INVENTORY_Y = 434;
	
	
	// Required assets
	var imgBackground;
	var imgConcrete;
	var imgBrick = [];
	var imgWater;
	
	
	var imgResultBoard = new Array();
	
	// Game state variables
	this.m_screenShakeX = 0;
	this.m_screenShakeY = 0;
	
	this.m_time = 0;
	
	this.m_map = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	];
	
	this.m_obstacles = new Array();
	
	this.m_tanks = new Array();
	this.m_tanks[TEAM_1] = new Array();
	this.m_tanks[TEAM_2] = new Array();
	
	this.m_bullets = new Array();
	this.m_bullets[TEAM_1] = new Array();
	this.m_bullets[TEAM_2] = new Array();
	
	this.m_bases = new Array();
	this.m_bases[TEAM_1] = new Array();
	this.m_bases[TEAM_2] = new Array();
	
	this.m_explosions = new Array();
	
	this.m_powerUps = new Array();
	
	this.m_strikes = new Array();
	this.m_strikes[TEAM_1] = new Array();
	this.m_strikes[TEAM_2] = new Array();
	
	this.m_inventory = new Array();
	
	this.m_state = STATE_WAITING_FOR_PLAYERS;
	this.m_suddenDeathTime = -1;
	this.m_matchResult = MATCH_RESULT_NOT_FINISH;
	this.m_matchResultTime = 0;
	
	
	// State exclusived variables
	var init = false;
	var packetList = new Array();
	
	var waterAnimation = 0;
	var waterAnimationCount = 0;
	
	var packetCount = 0;
	var timeCorrectionFactor = 0;
	
	var playControlling = 0;
	var rightPanel = g_graphicEngine.LoadImage("Image/UI/MetalBoard.png");
	var ffButton = g_graphicEngine.LoadImage("Image/UI/FastForwardButton.png");
	var rwButton = g_graphicEngine.LoadImage("Image/UI/RewindButton.png");
	
	var imgPowerUp = new Array();
	imgPowerUp[POWERUP_AIRSTRIKE] = g_graphicEngine.LoadImage("Image/PowerUp/Airstrike.png");
	imgPowerUp[POWERUP_EMP] = g_graphicEngine.LoadImage("Image/PowerUp/EMP.png");
	
	
	// Use this function to load all kind of assets, initialize anything that isn't related to gameplay
	this.Init = function () {
		if (init == false) {
			init = true;
			
			imgBackground = g_graphicEngine.LoadImage("Image/Map/Background.png");
			imgWater = g_graphicEngine.LoadImage("Image/Map/Water.png");
			imgConcrete = g_graphicEngine.LoadImage("Image/Map/Concrete.png");
			imgBrick[0] = g_graphicEngine.LoadImage("Image/Map/Brick 1.png");
			imgBrick[1] = g_graphicEngine.LoadImage("Image/Map/Brick 2.png");
			imgBrick[2] = g_graphicEngine.LoadImage("Image/Map/Brick 3.png");
			imgBrick[3] = g_graphicEngine.LoadImage("Image/Map/Brick 4.png");
			imgBrick[4] = g_graphicEngine.LoadImage("Image/Map/Brick 5.png");
			
			imgResultBoard[MATCH_RESULT_TEAM_1_WIN] = g_graphicEngine.LoadImage("Image/Strings/Team1Win.png");
			imgResultBoard[MATCH_RESULT_TEAM_2_WIN] = g_graphicEngine.LoadImage("Image/Strings/Team2Win.png");
			imgResultBoard[MATCH_RESULT_DRAW] = g_graphicEngine.LoadImage("Image/Strings/Draw.png");
			imgResultBoard[MATCH_RESULT_BAD_DRAW] = g_graphicEngine.LoadImage("Image/Strings/BadDraw.png");
			
			// Preload some particle
			g_graphicEngine.LoadImage("Image/Particle/Frag.png");
			g_graphicEngine.LoadImage("Image/Particle/HotTrail.png");
			g_graphicEngine.LoadImage("Image/Particle/WhiteSmoke.png");
			g_graphicEngine.LoadImage("Image/Particle/BlackSmoke.png");
		}
	}
	
	
	
	// Network - An update packet arrive
	// No matter if it's from a replay, or from the server
	this.OnUpdatePacket = function (data) {
		// Packet count also play a role on timeline
		// As we know, 100ms per packet to render.
		packetCount ++;
		
		// Read and decode
		var readOffset = 0;
		var endGameReached = false;
		while (true) {
			var command = DecodeUInt8 (data, readOffset); 
			readOffset++;
			
			if (command == COMMAND_UPDATE_STATE) {
				this.m_state = DecodeUInt8 (data, readOffset);
				if (this.m_state == STATE_SUDDEN_DEATH && this.m_suddenDeathTime == -1) {
					this.m_suddenDeathTime = packetCount;
				}
				readOffset++;
			}
			else if (command == COMMAND_UPDATE_TIME) {
				timeCorrectionFactor = DecodeInt16 (data, readOffset) + packetCount;
				readOffset += 2;
			}
			else if (command == COMMAND_UPDATE_MAP) {
				for (var i=0; i<MAP_W; i++) {
					for (var j=0; j<MAP_H; j++) {
						this.m_map[j * MAP_W + i] = DecodeUInt8 (data, readOffset);
						readOffset += 1;
					}
				}
			}
			else if (command == COMMAND_UPDATE_OBSTACLE) {
				readOffset += this.ProcessUpdateObstacleCommand(packetCount, data, readOffset);
			}
			else if (command == COMMAND_UPDATE_TANK) {
				readOffset += this.ProcessUpdateTankCommand(packetCount, data, readOffset);
			}
			else if (command == COMMAND_UPDATE_BULLET) {
				readOffset += this.ProcessUpdateBulletCommand(packetCount, data, readOffset);
			}
			else if (command == COMMAND_UPDATE_BASE) {
				readOffset += this.ProcessUpdateBaseCommand(packetCount, data, readOffset);
			}
			else if (command == COMMAND_UPDATE_POWERUP) {
				readOffset += this.ProcessUpdatePowerUpCommand(packetCount, data, readOffset);
			}
			else if (command == COMMAND_MATCH_RESULT) {
				readOffset += this.ProcessMatchResultCommand(packetCount, data, readOffset);
				endGameReached = true;
			}
			else if (command == COMMAND_UPDATE_INVENTORY) {
				readOffset += this.ProcessUpdateInventoryCommand(packetCount, data, readOffset);
			}
			else if (command == COMMAND_UPDATE_STRIKE) {
				readOffset += this.ProcessUpdateStrikeCommand(packetCount, data, readOffset);
			}
			else if (command == COMMAND_REQUEST_CONTROL) {
				
			}
			else {
				readOffset ++;
				console.log ("Invalid command id: " + command)
			}
			
			if (readOffset >= data.length) {
				break;
			}
		}
		
		// We must do a "fake update" on objects that are not updated by a packet
		// to create a sense of continuity in the timeline.
		this.AddIdleAnchor(packetCount);
	}
	
	this.AddIdleAnchor = function (time) {
		// Obstacles
		for (var i=0; i<this.m_obstacles.length; i++) {
			this.m_obstacles[i].AddIdleDataAnchor(time);
		}
		// Tank
		for (var i=0; i<this.m_tanks[TEAM_1].length; i++) {
			this.m_tanks[TEAM_1][i].AddIdleDataAnchor(time);
		}
		for (var i=0; i<this.m_tanks[TEAM_2].length; i++) {
			this.m_tanks[TEAM_2][i].AddIdleDataAnchor(time);
		}
		// Bullet
		for (var i=0; i<this.m_bullets[TEAM_1].length; i++) {
			this.m_bullets[TEAM_1][i].AddIdleDataAnchor(time);
		}
		for (var i=0; i<this.m_bullets[TEAM_2].length; i++) {
			this.m_bullets[TEAM_2][i].AddIdleDataAnchor(time);
		}
		// Strike
		for (var i=0; i<this.m_strikes[TEAM_1].length; i++) {
			this.m_strikes[TEAM_1][i].AddIdleDataAnchor(time);
		}
		for (var i=0; i<this.m_strikes[TEAM_2].length; i++) {
			this.m_strikes[TEAM_2][i].AddIdleDataAnchor(time);
		}
		// Base
		for (var i=0; i<this.m_bases[TEAM_1].length; i++) {
			this.m_bases[TEAM_1][i].AddIdleDataAnchor(time);
		}
		for (var i=0; i<this.m_bases[TEAM_2].length; i++) {
			this.m_bases[TEAM_2][i].AddIdleDataAnchor(time);
		}
		// Power up
		for (var i=0; i < this.m_powerUps.length; i++) {
			this.m_powerUps[i].AddIdleDataAnchor(time);
		}
	}
	
	this.ProcessUpdateObstacleCommand = function (time, data, originalOffset) {
		var offset = originalOffset;
		var id = DecodeUInt8 (data, offset); offset++;
		var x = DecodeUInt8 (data, offset); offset++;
		var y = DecodeUInt8 (data, offset); offset++;
		var HP = DecodeUInt8 (data, offset); offset++;
		
		if (this.m_obstacles[id] == null) {
			this.m_obstacles[id] = new Obstacle(this, id);
		}
		this.m_obstacles[id].AddDataAnchor(time, x, y, HP);

		return offset - originalOffset;
	}
	
	this.ProcessUpdateTankCommand = function (time, data, originalOffset) {
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
		
		if (this.m_tanks[team][id] == null) {
			this.m_tanks[team][id] = new Tank(this, id, team, type);
		}
		this.m_tanks[team][id].AddDataAnchor(time, x, y, dir, HP, cooldown, disabled);
		
		return offset - originalOffset;
	}
	
	this.ProcessUpdateBulletCommand = function (time, data, originalOffset) {
		var offset = originalOffset;
		var id = DecodeUInt8 (data, offset); 		offset++;
		var live = DecodeUInt8 (data, offset); 		offset++;
		var team = DecodeUInt8 (data, offset); 		offset++;
		var type = DecodeUInt8 (data, offset); 		offset++;
		var dir = DecodeUInt8 (data, offset); 		offset++;
		var speed = DecodeFloat32 (data, offset); 	offset+=4;
		var damage = DecodeUInt8 (data, offset); 	offset++;
		var hit = DecodeUInt8 (data, offset); 		offset++;
		var x = DecodeFloat32 (data, offset); 		offset+=4;
		var y = DecodeFloat32 (data, offset); 		offset+=4;
		
		if (this.m_bullets[team][id] == null) {
			this.m_bullets[team][id] = new Bullet(this, id, team);
		}
		this.m_bullets[team][id].AddDataAnchor(time, type, x, y, dir, live, hit, damage);
		
		return offset - originalOffset;
	}
	
	this.ProcessUpdateBaseCommand = function (time, data, originalOffset) {
		var offset = originalOffset;
		var id = DecodeUInt8 (data, offset); 		offset++;
		var team = DecodeUInt8 (data, offset); 		offset++;
		var type = DecodeUInt8 (data, offset); 		offset++;
		var HP = DecodeUInt16 (data, offset);		offset+=2;
		var x = DecodeFloat32 (data, offset); 		offset+=4;
		var y = DecodeFloat32 (data, offset); 		offset+=4;

		if (this.m_bases[team][id] == null)
			this.m_bases[team][id] = new Base(this, id, team, type);
		this.m_bases[team][id].AddDataAnchor(time, x, y, HP);

		return offset - originalOffset;
	}
	
	this.ProcessUpdatePowerUpCommand = function(time, data, originalOffset) {
		var offset = originalOffset;
		var id = DecodeUInt8 (data, offset); 		offset++;
		var active = DecodeUInt8 (data, offset); 	offset++;
		var type = DecodeUInt8 (data, offset); 		offset++;
		var x = DecodeFloat32 (data, offset); 		offset+=4;
		var y = DecodeFloat32 (data, offset); 		offset+=4;
		
		if (this.m_powerUps[id] == null)
			this.m_powerUps[id] = new PowerUp(this, id);
		this.m_powerUps[id].AddDataAnchor(time, x, y, active, type);
		
		return offset - originalOffset;
	}
	
	this.ProcessUpdateStrikeCommand = function(time, data, originalOffset) {
		var offset = originalOffset;
		var id = DecodeUInt8 (data, offset); 		offset++;
		var team = DecodeUInt8 (data, offset); 		offset++;
		var type = DecodeUInt8 (data, offset); 		offset++;
		var live = DecodeUInt8 (data, offset); 		offset++;
		var countDown = DecodeUInt8 (data, offset);	offset++;
		var x = DecodeFloat32 (data, offset); 		offset+=4;
		var y = DecodeFloat32 (data, offset); 		offset+=4;
		
		if (this.m_strikes[team][id] == null) {
			this.m_strikes[team][id] = new Strike(this, id, team);
		}
		this.m_strikes[team][id].AddDataAnchor(time, type, x, y, countDown, live);
		
		return offset - originalOffset;
	}
	
	this.ProcessUpdateInventoryCommand = function (time, data, originalOffset) {
		var index = this.m_inventory.length;
		this.m_inventory[index] = new Array();
		this.m_inventory[index][TEAM_1] = new Array();
		this.m_inventory[index][TEAM_2] = new Array();
		this.m_inventory[index]["time"] = time;

		var offset = originalOffset;
		var number1 = DecodeUInt8 (data, offset); offset++;
		for (var i=0; i<number1; i++) {
			this.m_inventory[index][TEAM_1][i] = DecodeUInt8 (data, offset); offset++;
		}
		var number2 = DecodeUInt8 (data, offset); offset++;
		for (var i=0; i<number2; i++) {
			this.m_inventory[index][TEAM_2][i] = DecodeUInt8 (data, offset); offset++;
		}
		
		return offset - originalOffset;
	}
	
	this.ProcessMatchResultCommand = function (time, data, originalOffset) {
		var offset = originalOffset;
		var matchResult = DecodeUInt8 (data, offset); offset++;
		
		this.m_matchResult = matchResult;
		this.m_matchResultTime = time;
		
		return offset - originalOffset;
	}
	
	
	
	
	this.SpawnExplosion = function (time, type, x, y, angle, flipX, flipY) {
		var tempExplosion = null;
		for (var i=0; i<this.m_explosions.length; i++) {
			if (this.m_explosions[i].IsFreeAt(time) == true) {
				tempExplosion = this.m_explosions[i];
			}
		}
		if (tempExplosion == null) {
			tempExplosion = new Explosion (this, this.m_explosions.length);
			this.m_explosions.push (tempExplosion);
		}
		tempExplosion.Spawn (time, type, x, y, angle, flipX, flipY);
	}
	
	
	
	// Update
	this.Update = function (deltaTime) {
		// Check mouse
		if (g_inputEngine.m_mousePress == 1) {
			if (g_inputEngine.m_mouseX >= RW_BUTTON_X && g_inputEngine.m_mouseX <= RW_BUTTON_X + RW_BUTTON_W && g_inputEngine.m_mouseY >= RW_BUTTON_Y && g_inputEngine.m_mouseY <= RW_BUTTON_Y + RW_BUTTON_H) {
				playControlling = -1;
			}
			else if (g_inputEngine.m_mouseX >= FF_BUTTON_X && g_inputEngine.m_mouseX <= FF_BUTTON_X + FF_BUTTON_W && g_inputEngine.m_mouseY >= FF_BUTTON_Y && g_inputEngine.m_mouseY <= FF_BUTTON_Y + FF_BUTTON_H) {
				playControlling = 1;
			}
			else {
				playControlling = 0;
			}
		}
		else {
			playControlling = 0;
		}
		
		
		// Increase the time line.
		var deltaTimeForParticle = deltaTime;
		var deltaTimeForRender = 0;
		if (playControlling == 0) {
			deltaTimeForRender = deltaTime / PACKET_PROCESS_INTERVAL;
			if (this.m_time > this.m_matchResultTime && this.m_matchResultTime != 0) {
				deltaTimeForRender = deltaTimeForRender * 0.4;
				deltaTimeForParticle = deltaTimeForParticle * 0.4;
			}
		}
		else if (playControlling == 1) {
			deltaTimeForRender = deltaTime * 4 / PACKET_PROCESS_INTERVAL;
		}
		else if (playControlling == -1) {
			deltaTimeForRender = -deltaTime * 4 / PACKET_PROCESS_INTERVAL;
		}
		
		this.m_time += deltaTimeForRender;
		
		// Not enough data received to continue rendering
		if (this.m_time >= packetCount - 1) {
			// Revert, and don't update
			this.m_time -= deltaTimeForRender;
			return
		}
		else if (this.m_time < 1) {
			this.m_time = 1;
			return
		}
		
		g_particleEngine.Update (deltaTimeForParticle);
		
		// Update destructible obstacles
		for (var i=0; i<this.m_obstacles.length; i++) {
			this.m_obstacles[i].Update(this.m_time);
		}
		
		// Update tank
		for (var i=0; i<this.m_tanks[TEAM_1].length; i++) {
			this.m_tanks[TEAM_1][i].Update(this.m_time);
		}
		for (var i=0; i<this.m_tanks[TEAM_2].length; i++) {
			this.m_tanks[TEAM_2][i].Update(this.m_time);
		}
		
		// Update bullet
		for (var i=0; i<this.m_bullets[TEAM_1].length; i++) {
			this.m_bullets[TEAM_1][i].Update(this.m_time);
		}
		for (var i=0; i<this.m_bullets[TEAM_2].length; i++) {
			this.m_bullets[TEAM_2][i].Update(this.m_time);
		}
		
		// Update strike
		for (var i=0; i<this.m_strikes[TEAM_1].length; i++) {
			this.m_strikes[TEAM_1][i].Update(this.m_time);
		}
		for (var i=0; i<this.m_strikes[TEAM_2].length; i++) {
			this.m_strikes[TEAM_2][i].Update(this.m_time);
		}
		
		// Update base
		for (var i=0; i<this.m_bases[TEAM_1].length; i++) {
			this.m_bases[TEAM_1][i].Update(this.m_time);
		}
		for (var i=0; i<this.m_bases[TEAM_2].length; i++) {
			this.m_bases[TEAM_2][i].Update(this.m_time);
		}
		
		// Update power up
		for (var i=0; i < this.m_powerUps.length; i++) {
			this.m_powerUps[i].Update(this.m_time);
		}
		
		// Update explosion
		for (var i=0; i < this.m_explosions.length; i++) {
			this.m_explosions[i].Update(this.m_time);
		}
		
		// Animate the water tiles
		waterAnimationCount += deltaTimeForParticle;
		if (waterAnimationCount > MAP_WATER_FRAME_DURATION) {
			waterAnimation ++;
			if (waterAnimation >= MAP_WATER_FRAME_NUMBER) {
				waterAnimation = 0;
			}
			waterAnimationCount -= MAP_WATER_FRAME_DURATION;
		}
		
		g_soundEngine.Update (deltaTime);
	}
	
	// Draw all
	this.Draw = function () {
		// Draw animated water
		for (var i=0; i<MAP_W; i++) {
			for (var j=0; j<MAP_H; j++) {
				if (this.m_map[j * MAP_W + i] == BLOCK_WATER) {
					var frameRow = waterAnimation % MAP_WATER_SPRITE_W; 
					var frameCol = (waterAnimation / MAP_WATER_SPRITE_W) >> 0;
					g_graphicEngine.Draw (g_context, imgWater, frameRow * BLOCK_SIZE, frameCol * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, i * BLOCK_SIZE + this.m_screenShakeX, j * BLOCK_SIZE + this.m_screenShakeY, BLOCK_SIZE, BLOCK_SIZE, MAP_WATER_ALPHA);
				}
			}
		}
		
		// Then draw background on top
		g_graphicEngine.DrawFast (g_context, imgBackground, MAP_OFFSET_X + this.m_screenShakeX, MAP_OFFSET_Y + this.m_screenShakeY);
		
		
		// Draw all undestructible obstacles
		for (var i=0; i<MAP_W; i++) {
			for (var j=0; j<MAP_H; j++) {
				if (this.m_map[j * MAP_W + i] == BLOCK_HARD_OBSTACLE) {
					g_graphicEngine.DrawFast (g_context, imgConcrete, i * BLOCK_SIZE + this.m_screenShakeX, j * BLOCK_SIZE + this.m_screenShakeY);
				}
			}
		}

		// Draw destructible obstacles
		for (var i=0; i<this.m_obstacles.length; i++) {
			this.m_obstacles[i].Draw();
		}

		// Draw player bases
		for (var i=0; i<this.m_bases[TEAM_1].length; i++) {
			this.m_bases[TEAM_1][i].Draw();
		}
		for (var i=0; i<this.m_bases[TEAM_2].length; i++) {
			this.m_bases[TEAM_2][i].Draw();
		}
		
		// Draw tanks
		for (var i=0; i<this.m_tanks[TEAM_1].length; i++) {
			this.m_tanks[TEAM_1][i].Draw();
		}
		for (var i=0; i<this.m_tanks[TEAM_2].length; i++) {
			this.m_tanks[TEAM_2][i].Draw();
		}
		
		// Draw power up
		for (var i=0; i<this.m_powerUps.length; i++) {
			this.m_powerUps[i].Draw();
		}
		
		// Draw bullets
		for (var i=0; i<this.m_bullets[TEAM_1].length; i++) {
			this.m_bullets[TEAM_1][i].Draw();
		}
		for (var i=0; i<this.m_bullets[TEAM_2].length; i++) {
			this.m_bullets[TEAM_2][i].Draw();
		}
		
		// Draw explosion
		for (var i=0; i<this.m_explosions.length; i++) {
			this.m_explosions[i].Draw();
		}
		
		// Draw strikes
		for (var i=0; i<this.m_strikes[TEAM_1].length; i++) {
			this.m_strikes[TEAM_1][i].Draw();
		}
		for (var i=0; i<this.m_strikes[TEAM_2].length; i++) {
			this.m_strikes[TEAM_2][i].Draw();
		}
		
		// Particle
		g_particleEngine.Draw (g_context, this.m_screenShakeX, this.m_screenShakeY, CANVAS_W, CANVAS_H);
		
		//le.huathi - draw match result if needed
		if (this.m_matchResult != MATCH_RESULT_NOT_FINISH && this.m_time >= this.m_matchResultTime) {
			var boardY = -RESULT_BOARD_H + (this.m_time - this.m_matchResultTime) * 80;
			if (boardY > MAP_H * BLOCK_SIZE / 2 - RESULT_BOARD_H / 2) {
				boardY = MAP_H * BLOCK_SIZE / 2 - RESULT_BOARD_H / 2;
			}
			g_graphicEngine.DrawFast (g_context, imgResultBoard[this.m_matchResult], MAP_W * BLOCK_SIZE / 2 + this.m_screenShakeX - RESULT_BOARD_W / 2, boardY + this.m_screenShakeY);
		}
		else if (this.m_matchResult != MATCH_RESULT_NOT_FINISH && this.m_matchResultTime <= 10) {
			g_graphicEngine.DrawFast (g_context, imgResultBoard[this.m_matchResult], MAP_W * BLOCK_SIZE / 2 + this.m_screenShakeX - RESULT_BOARD_W / 2, MAP_H * BLOCK_SIZE / 2 + this.m_screenShakeY - RESULT_BOARD_H / 2);
		}
		
		
		g_graphicEngine.DrawFast (g_context, rightPanel, CANVAS_W - 305, 0);
		
		for (var i=this.m_inventory.length-1; i>=0; i--) {
			if (this.m_time > this.m_inventory[i]["time"]) {
				for (var j=0; j<this.m_inventory[i][TEAM_1].length; j++) {
					g_graphicEngine.DrawFast (g_context, imgPowerUp[this.m_inventory[i][TEAM_1][j]], TEAM_1_INVENTORY_X + j * 45, TEAM_1_INVENTORY_Y);
				}
				for (var j=0; j<this.m_inventory[i][TEAM_2].length; j++) {
					g_graphicEngine.DrawFast (g_context, imgPowerUp[this.m_inventory[i][TEAM_2][j]], TEAM_2_INVENTORY_X + j * 45, TEAM_2_INVENTORY_Y);
				}
				
				break;
			}
		}
		
		if (playControlling == -1) {
			g_graphicEngine.Draw (g_context, rwButton, 0, RW_BUTTON_H, RW_BUTTON_W, RW_BUTTON_H, RW_BUTTON_X, RW_BUTTON_Y, RW_BUTTON_W, RW_BUTTON_H, 1);
		}
		else {
			g_graphicEngine.Draw (g_context, rwButton, 0, 0, RW_BUTTON_W, RW_BUTTON_H, RW_BUTTON_X, RW_BUTTON_Y, RW_BUTTON_W, RW_BUTTON_H, 1);
		}
		if (playControlling == 1) {
			g_graphicEngine.Draw (g_context, ffButton, 0, FF_BUTTON_H, FF_BUTTON_W, FF_BUTTON_H, FF_BUTTON_X, FF_BUTTON_Y, FF_BUTTON_W, FF_BUTTON_H, 1);
		}
		else {
			g_graphicEngine.Draw (g_context, ffButton, 0, 0, FF_BUTTON_W, FF_BUTTON_H, FF_BUTTON_X, FF_BUTTON_Y, FF_BUTTON_W, FF_BUTTON_H, 1);
		}
		
		
		if (this.m_time > this.m_suddenDeathTime && this.m_suddenDeathTime != -1) {
			//timeBoard.SetNumber (((timeCorrectionFactor - this.m_time) * PACKET_PROCESS_INTERVAL / 1000) >> 0, true);
			var time = ((timeCorrectionFactor - this.m_time) * PACKET_PROCESS_INTERVAL / 1000) >> 0;
			g_graphicEngine.DrawTextRGB (g_context, time, TIME_BOARD_X, TIME_BOARD_Y, 200, "BlackOpsOne", 50, true, false, "center", "center", 193, 0, 12, 0.9, false, false, 150, 150, 150);
		}
		else {
			//timeBoard.SetNumber ((((timeCorrectionFactor - this.m_time) * PACKET_PROCESS_INTERVAL / 1000) - SUDDEN_DEATH_DURATION) >> 0, false);
			var time = (((timeCorrectionFactor - this.m_time) * PACKET_PROCESS_INTERVAL / 1000) - SUDDEN_DEATH_DURATION) >> 0;
			g_graphicEngine.DrawTextRGB (g_context, time, TIME_BOARD_X, TIME_BOARD_Y, 200, "BlackOpsOne", 50, false, false, "center", "center", 189, 189, 189, 0.9, false, false, 150, 150, 150);
		}
		
	}
}