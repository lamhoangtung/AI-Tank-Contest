// Stuff...
var Enum = require("./Config/Enum");
var Setting = require("./Config/Setting");
var Network = require("./Network");

// Game object
var Tank = require("./Objects/Tank");
var Obstacle = require("./Objects/Obstacle");
var Bullet = require("./Objects/Bullet");
var Base = require("./Objects/Base");
var PowerUp = require("./Objects/PowerUp")
var Strike = require("./Objects/Strike");

// Require filesystem
var fs = require('fs');

var rollInt = function (mn, mx) { return Math.floor(mn + Math.random() * (1 + mx - mn)); };

module.exports = function Game (key1, key2, replayFilename) {
	var instance = this;
	// Get the map data
	this.m_map = Setting.MAP;
	
	// Hold all game object here
	this.m_obstacles = new Array();
	for (var i=0; i<Setting.MAP_W; i++) {
		for (var j=0; j<Setting.MAP_H; j++) {
			if (this.m_map[j * Setting.MAP_W + i] == Enum.BLOCK_SOFT_OBSTACLE) {
				var id = this.m_obstacles.length;
				this.m_obstacles.push(new Obstacle (this, id, i, j));
			}
		}
	}
	
	this.m_tanks = new Array();
	this.m_tanks[Enum.TEAM_1] = new Array();
	this.m_tanks[Enum.TEAM_2] = new Array();
	
	this.m_bullets = new Array();
	this.m_bullets[Enum.TEAM_1] = new Array();
	this.m_bullets[Enum.TEAM_2] = new Array();
	
	this.m_inventory = new Array();
	this.m_inventory[Enum.TEAM_1] = new Array();
	this.m_inventory[Enum.TEAM_2] = new Array();

	//le.huathi - init player bases
	this.m_bases = new Array();
	this.m_bases[Enum.TEAM_1] = new Array();
	this.m_bases[Enum.TEAM_2] = new Array();
	this.m_bases[Enum.TEAM_1].push(new Base(this, 0, Setting.BASE_POSITION_1[0][0], Setting.BASE_POSITION_1[0][1], Enum.TEAM_1, Enum.BASE_MAIN));
	this.m_bases[Enum.TEAM_1].push(new Base(this, 1, Setting.BASE_POSITION_1[1][0], Setting.BASE_POSITION_1[1][1], Enum.TEAM_1, Enum.BASE_SIDE));
	this.m_bases[Enum.TEAM_1].push(new Base(this, 2, Setting.BASE_POSITION_1[2][0], Setting.BASE_POSITION_1[2][1], Enum.TEAM_1, Enum.BASE_SIDE));
	this.m_bases[Enum.TEAM_2].push(new Base(this, 0, Setting.BASE_POSITION_2[0][0], Setting.BASE_POSITION_2[0][1], Enum.TEAM_2, Enum.BASE_MAIN));
	this.m_bases[Enum.TEAM_2].push(new Base(this, 1, Setting.BASE_POSITION_2[1][0], Setting.BASE_POSITION_2[1][1], Enum.TEAM_2, Enum.BASE_SIDE));
	this.m_bases[Enum.TEAM_2].push(new Base(this, 2, Setting.BASE_POSITION_2[2][0], Setting.BASE_POSITION_2[2][1], Enum.TEAM_2, Enum.BASE_SIDE));
	
	this.m_powerUps = new Array();
	
	this.m_strikes = new Array();
	this.m_strikes[Enum.TEAM_1] = new Array();
	this.m_strikes[Enum.TEAM_2] = new Array();
	
	//le.huathi - match result
	this.m_loser = new Array();
	this.m_loser[Enum.TEAM_1] = false;
	this.m_loser[Enum.TEAM_2] = false;
	this.m_matchResult = Enum.MATCH_RESULT_NOT_FINISH;
	this.m_teamLostSuddenDeath = -1; //for checking if base's destroyed in sudden death mode
	
	// Internal variables?
	this.m_server = null;
	this.m_player1Index = -1;
	this.m_player2Index = -1;
	
	this.m_state = Enum.STATE_WAITING_FOR_PLAYERS;
	this.m_loopNumber = 0;
	this.m_spawnPowerUpCount = 0;
	
	var inventoryDirty = false;
	var loopBeforeEnding = 20;
	
	// Replay String
	var replayData = new Array();
	
	
	// ==================================================================
	// Start timeout checking here.
	function CheckConnection() {
		if (instance.m_player1Index != -1 && instance.m_player2Index != -1) {
			// Both player has connected, we do nothing
		}
		else {
			if (instance.m_player1Index != -1 && instance.m_player2Index == -1) {
				instance.m_matchResult = Enum.MATCH_RESULT_TEAM_1_WIN;
				instance.m_state = Enum.STATE_FINISHED;
			}
			else if (instance.m_player1Index == -1 && instance.m_player2Index != -1) {
				instance.m_matchResult = Enum.MATCH_RESULT_TEAM_2_WIN;
				instance.m_state = Enum.STATE_FINISHED;
			}
			else if (instance.m_player1Index == -1 && instance.m_player2Index == -1) {
				instance.m_matchResult = Enum.MATCH_RESULT_BAD_DRAW;
				instance.m_state = Enum.STATE_FINISHED;
			}
			
			matchResultPacket = instance.GetMatchResultPackage();
			stateUpdatePacket = instance.GetStateUpdatePacket();
			
			instance.Broadcast (stateUpdatePacket + matchResultPacket);
			instance.AddToReplay (matchResultPacket);
			
			setTimeout(function() {
				instance.SaveReplay();
			}, 2000);
		}
	}
	setTimeout(CheckConnection, Setting.CONNECTION_TIMEOUT);
	
	function CheckPickTank() {
		if (instance.m_tanks[Enum.TEAM_1].length == Setting.NUMBER_OF_TANK && instance.m_tanks[Enum.TEAM_2].length == Setting.NUMBER_OF_TANK) {
			
		}
		else {
			if (instance.m_tanks[Enum.TEAM_1].length < Setting.NUMBER_OF_TANK && instance.m_tanks[Enum.TEAM_2].length < Setting.NUMBER_OF_TANK) {
				instance.m_matchResult = Enum.MATCH_RESULT_BAD_DRAW;
				instance.m_state = Enum.STATE_FINISHED;
			}
			else if (instance.m_tanks[Enum.TEAM_1].length == Setting.NUMBER_OF_TANK && instance.m_tanks[Enum.TEAM_2].length < Setting.NUMBER_OF_TANK) {
				instance.m_matchResult = Enum.MATCH_RESULT_TEAM_1_WIN;
				instance.m_state = Enum.STATE_FINISHED;
			}
			else if (instance.m_tanks[Enum.TEAM_1].length < Setting.NUMBER_OF_TANK && instance.m_tanks[Enum.TEAM_2].length == Setting.NUMBER_OF_TANK) {
				instance.m_matchResult = Enum.MATCH_RESULT_TEAM_2_WIN;
				instance.m_state = Enum.STATE_FINISHED;
			}
			
			matchResultPacket = instance.GetMatchResultPackage();
			stateUpdatePacket = instance.GetStateUpdatePacket();
			
			instance.Broadcast (stateUpdatePacket + matchResultPacket);
			instance.AddToReplay (matchResultPacket);
			
			setTimeout(function() {
				instance.SaveReplay();
			}, 2000);
		}
	}
	
	
	// ==================================================================
	
	// ==================================================================
	// Basic network command
	this.SetServerInstance = function (server) {
		this.m_server = server;
	}
	this.Send = function (player, data) {
		if (this.m_server) {
			this.m_server.Send (player, data);
		}
	}
	this.Broadcast = function (data) {
		if (this.m_server) {
			this.m_server.Broadcast (data);
		}
	}
	
	
	this.OnCommand = function (sender, data) {
		var readOffset = 0; 
		while (true) {
			var command = Network.DecodeUInt8 (data, readOffset); 
			readOffset++;
			
			if (command == Enum.COMMAND_PING) {
				// Receive a ping? Just send it back.
				this.Send (sender, data);
			}
			else if (command == Enum.COMMAND_SEND_KEY) {
				var announceTeamPacket = "";
				
				var key = Network.DecodeInt8 (data, readOffset); readOffset ++;
				
				// If the one who've just connected have a correct key
				if (key == key1 || key == key2) {
					var team;
					if (key == key1) {
						this.m_player1Index = sender;
						team = Enum.TEAM_1;
					}
					if (key == key2) {
						this.m_player2Index = sender;
						team = Enum.TEAM_2;
					}
					// Prepare to tell him his team id.
					// We merge this packet to fullsync and send it below.
					announceTeamPacket += Network.EncodeUInt8(Enum.COMMAND_SEND_TEAM);
					announceTeamPacket += Network.EncodeUInt8(team);
				}
				
				// Send full sync, so everyone can setup their own data
				this.Send (sender, announceTeamPacket + this.GetFullSyncPacket());
				
				// When both player are connected
				// Change to state place tank, and announce to all party
				if (this.m_state == Enum.STATE_WAITING_FOR_PLAYERS && this.m_player1Index != -1 && this.m_player2Index != -1) {
					this.m_state = Enum.STATE_TANK_PLACEMENT;
					this.Broadcast (this.GetStateUpdatePacket());
					
					setTimeout(CheckPickTank, Setting.PICK_TANK_TIMEOUT);
				}
			}
			else if (command == Enum.COMMAND_CONTROL_PLACE) {
				// Only allow to place tank during this state
				if (this.m_state == Enum.STATE_TANK_PLACEMENT) {
					// Who send?
					var team = -1;
					if (sender == this.m_player1Index) 		team = Enum.TEAM_1;
					else if (sender == this.m_player2Index) team = Enum.TEAM_2;
					
					// Oh, the correct player sent it.
					if (team == Enum.TEAM_1 || team == Enum.TEAM_2) {
						var type = Network.DecodeUInt8 (data, readOffset); 	readOffset++;
						var x = Network.DecodeUInt8 (data, readOffset); 	readOffset++;
						var y = Network.DecodeUInt8 (data, readOffset); 	readOffset++;
						
						this.PickTank (team, type, x, y);
					}
					
					// When enough tank picked, start the game.
					if (this.m_tanks[Enum.TEAM_1].length == Setting.NUMBER_OF_TANK && this.m_tanks[Enum.TEAM_2].length == Setting.NUMBER_OF_TANK) {
						this.m_state = Enum.STATE_ACTION;
						var fullSyncPacket = this.GetFullSyncPacket();
						this.Broadcast (fullSyncPacket);
						this.AddToReplay (fullSyncPacket);
						this.Start();
					}
				}
			}
			else if (command == Enum.COMMAND_CONTROL_UPDATE) {
				// Who send?
				var team = -1;
				if (sender == this.m_player1Index) 		team = Enum.TEAM_1;
				else if (sender == this.m_player2Index) team = Enum.TEAM_2;
				
				// Oh, the correct player sent it.
				if (team == Enum.TEAM_1 || team == Enum.TEAM_2) {
					var id = Network.DecodeUInt8 (data, readOffset); 		readOffset++;
					var dir = Network.DecodeUInt8 (data, readOffset); 		readOffset++;
					var move = Network.DecodeUInt8 (data, readOffset); 		readOffset++;
					var shoot = Network.DecodeUInt8 (data, readOffset); 	readOffset++;
					
					this.m_tanks[team][id].Turn(dir);
					if (move) {
						this.m_tanks[team][id].Move();
					}
					if (shoot) {
						this.m_tanks[team][id].Shoot();
					}
				}
			}
			else if (command == Enum.COMMAND_CONTROL_USE_POWERUP) {
				// Who send?
				var team = -1;
				if (sender == this.m_player1Index) 		team = Enum.TEAM_1;
				else if (sender == this.m_player2Index) team = Enum.TEAM_2;
				
				// Oh, the correct player sent it.
				if (team == Enum.TEAM_1 || team == Enum.TEAM_2) {
					var powerup = Network.DecodeUInt8 (data, readOffset); 	readOffset++;
					var x = Network.DecodeFloat32 (data, readOffset); 		readOffset += 4;
					var y = Network.DecodeFloat32 (data, readOffset); 		readOffset += 4;
					
					this.UsePowerUp (team, powerup, x, y);
				}
				
			}
			else {
				// TODO: What should we do when an invalid command is issued?
				console.log ("Invalid command id: " + command)
				return;
			}
			
			// Break when the end of the packet reach
			if (readOffset >= data.length) {
				break;
			}
		}
	}
	// ==================================================================
	
	
	
	
	
	// ==================================================================
	// Package handling
	this.GetStateUpdatePacket = function() {
		var packet = "";
		packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_STATE);
		packet += Network.EncodeUInt8(this.m_state);
		return packet;
	}
	this.GetUpdatePacket = function (force) {
		// Command
		var packet = "";
		
		// Time
		packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_TIME);
		packet += Network.EncodeInt16(Setting.LOOPS_MATCH_END - instance.m_loopNumber);
		
		
		
		// Tank
		for (var i=0; i<this.m_tanks[Enum.TEAM_1].length; i++) {
			packet += this.m_tanks[Enum.TEAM_1][i].ToPacket(force);
		}
		for (var i=0; i<this.m_tanks[Enum.TEAM_2].length; i++) {
			packet += this.m_tanks[Enum.TEAM_2][i].ToPacket(force);
		}
		
		// Bullet
		for (var i=0; i<this.m_bullets[Enum.TEAM_1].length; i++) {
			packet += this.m_bullets[Enum.TEAM_1][i].ToPacket(force);
		}
		for (var i=0; i<this.m_bullets[Enum.TEAM_2].length; i++) {
			packet += this.m_bullets[Enum.TEAM_2][i].ToPacket(force);
		}
		
		//Obstacles
		for (var i=0; i<this.m_obstacles.length; i++) {
			packet += this.m_obstacles[i].ToPacket(force);
		}
		
		// Bases
		for (var i=0; i<this.m_bases[Enum.TEAM_1].length; i++) {
			packet += this.m_bases[Enum.TEAM_1][i].ToPacket(force);
		}
		for (var i=0; i<this.m_bases[Enum.TEAM_2].length; i++) {
			packet += this.m_bases[Enum.TEAM_2][i].ToPacket(force);
		}
		
		// Power Up
		for (var i=0; i< this.m_powerUps.length; i++) {
			packet += this.m_powerUps[i].ToPacket(force);
		}
		
		// Strike
		for (var i=0; i<this.m_strikes[Enum.TEAM_1].length; i++) {
			packet += this.m_strikes[Enum.TEAM_1][i].ToPacket(force);
		}
		for (var i=0; i<this.m_strikes[Enum.TEAM_2].length; i++) {
			packet += this.m_strikes[Enum.TEAM_2][i].ToPacket(force);
		}
		
		
		// Inventory
		packet += this.GetInventoryPacket(false);
		
		return packet;
	}
	this.GetInventoryPacket = function (force) {
		var packet = "";
		
		if (force || inventoryDirty) {
			// Code
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_INVENTORY);
			
			// Number of power up belong to team 1
			packet += Network.EncodeUInt8(this.m_inventory[Enum.TEAM_1].length);
			// Each of them
			for (var i=0; i<this.m_inventory[Enum.TEAM_1].length; i++) {
				packet += Network.EncodeUInt8(this.m_inventory[Enum.TEAM_1][i]);
			}
			
			// Number of power up belong to team 2
			packet += Network.EncodeUInt8(this.m_inventory[Enum.TEAM_2].length);
			// Each of them
			for (var i=0; i<this.m_inventory[Enum.TEAM_2].length; i++) {
				packet += Network.EncodeUInt8(this.m_inventory[Enum.TEAM_2][i]);
			}
		}
		
		inventoryDirty = false;
		
		return packet;
	}
	this.GetFullSyncPacket = function () {
		// Command
		var packet = "";
		packet += this.GetStateUpdatePacket();
		
		// Map - (not this way)
		packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_MAP);
		for (var i=0; i<Setting.MAP_W; i++) {
			for (var j=0; j<Setting.MAP_H; j++) {
				packet += Network.EncodeUInt8(this.m_map[j * Setting.MAP_W + i])
			}
		}
		
		packet += this.GetInventoryPacket(true);
		packet += this.GetUpdatePacket(true);
		
		return packet;
	}
	
	
	
	this.GetMatchResultPackage = function() {
		// Command
		var packet = Network.EncodeUInt8(Enum.COMMAND_MATCH_RESULT);
		// match result
		packet += Network.EncodeUInt8(this.m_matchResult);
		return packet;
	}
	// ==================================================================
	
	
	
	
	
	
	
	
	
	// ==================================================================
	// Game logic
	this.PickTank = function (player, type, x, y) {
		// Check if this player have picked enough tank
		if (this.m_tanks[player].length == Setting.NUMBER_OF_TANK) {
			console.log ("Player " + player + " tried to pick more tank than he is allowed.");
			return false;
		}
		// Check if tank is out of map
		if (x < 0 || x > 22 || y < 0 || y > 22) {
			console.log ("Player " + player + " tried to place a tank out side of the map.");
			return false;
		}
		// Check if tank is out of base
		if (player == Enum.TEAM_1 && x > 7) {
			console.log ("Player " + player + " tried to place a tank out side of his base.");
			return false;
		}
		else if (player == Enum.TEAM_2 && x < 14) {
			console.log ("Player " + player + " tried to place a tank out side of his base.");
			return false;
		}
		// Check collision with map
		if (this.m_map[y * Setting.MAP_W + x] != Enum.BLOCK_GROUND) {
			console.log ("Player " + player + " tried to place a tank on an obstacles.");
			return false;
		}
		// Check collision with other tank
		for (var i=0; i<this.m_tanks[player].length; i++) {
			if (this.m_tanks[player][i].m_x == x && this.m_tanks[player][i].m_y == y) {
				console.log ("Player " + player + " tried to place a tank on another tank.");
				return false;
			}
		}
		// Check collision with base building
		if (this.m_map[y * Setting.MAP_W + x] == Enum.BLOCK_BASE) {
			console.log ("Player " + player + " tried to place a tank on a base.");
			return false;
		}
		
		// All valid
		var id = this.m_tanks[player].length;
		var tempTank = new Tank(this, id, x, y, player, type);
		this.m_tanks[player].push (tempTank);
		
		return true;
	}
	
	this.Fire = function(tank) {
		var team = tank.m_team;
		var bullet = null;
		for (var i=0; i<this.m_bullets[team].length; i++) {
			if (this.m_bullets[team][i].m_live == false && this.m_bullets[team][i].m_needToAnnounceHit == false) {
				bullet = this.m_bullets[team][i];
			}
		}
		
		if (bullet == null) {
			var id = this.m_bullets[team].length;
			bullet = new Bullet (this, team, id);
			this.m_bullets[team][id] = bullet;
		}
		bullet.Fire (tank.m_x, tank.m_y, tank.m_type, tank.m_direction);
	}
	
	this.SpawnPowerUp = function() {
		for (var i=0; i<this.m_powerUps.length; i++) {
			if (this.m_powerUps[i].m_active == false) {
				this.m_powerUps[i].Spawn();
				return;
			}
		}
		
		var newPowerUp = new PowerUp(this, this.m_powerUps.length);
		this.m_powerUps.push (newPowerUp);
		newPowerUp.Spawn();
	}
	
	this.AcquirePowerup = function(team, powerUp) {
		this.m_inventory[team].push (powerUp);
		inventoryDirty = true;
	}
	
	
	this.UsePowerUp = function (team, powerup, x, y) {
		var checkOK = false;
		
		for (var i=0; i<this.m_inventory[team].length; i++) {
			if (this.m_inventory[team][i] == powerup) {
				this.m_inventory[team].splice (i, 1);
				inventoryDirty = true;
				checkOK = true;
				break;
			}
		}
		
		if (checkOK) {
			var strike = null;
			for (var i=0; i<this.m_strikes[team].length; i++) {
				if (this.m_strikes[team][i].m_live == false) {
					strike = this.m_strikes[team][i];
				}
			}
			
			if (strike == null) {
				var id = this.m_strikes[team].length;
				strike = new Strike (this, id, team);
				this.m_strikes[team][id] = strike;
			}
			strike.Spawn (powerup, x, y);
		}
	}
	
	
	
	this.Start = function() {
		setInterval (this.Update, Setting.TIME_UPDATE_INTERVAL);
		this.SpawnPowerUp();
	}
	
	this.CloseServer = function() {
		instance.m_server.CloseServer();
	}
	
	this.AddToReplay = function (data) {
		if (replayFilename != null) {
			replayData.push(Network.EncodeUInt16(data.length) + data);
		}
	}
	this.SaveReplay = function() {
		if (replayFilename != null) {
			var replayString = "";
			for (var i = 0; i < replayData.length; i++)
				replayString += replayData[i];
				
			var buffer = new Buffer(replayString);
			var path = replayFilename;
			
			fs.open(path, 'w', function(err, fd) {
				if (err) {
					instance.CloseServer();
				}
				
				fs.write(fd, buffer, 0, buffer.length, null, function(err) {
					if (err) {
						instance.CloseServer();
					}
					
					fs.close(fd, function() {
						instance.CloseServer();	// Close server after done writing replay string to file
					});
				});
			});
		}
	}
	
	this.Update = function() {
		// If game has result,
		if (instance.m_matchResult != Enum.MATCH_RESULT_NOT_FINISH) {
			loopBeforeEnding --;
			//Save replay, CloseServer will be called after done writing replay string to file
			if (loopBeforeEnding == 0) {
				instance.SaveReplay();	
				return;
			}
			else if (loopBeforeEnding < 0) {
				return;			
			}
		}
		
		instance.m_loopNumber ++;
		
		instance.m_spawnPowerUpCount ++;
		if (instance.m_spawnPowerUpCount >= Setting.POWERUP_INTERVAL) {
			instance.m_spawnPowerUpCount -= Setting.POWERUP_INTERVAL;
			instance.SpawnPowerUp();
		}
		
		// Update all tank
		for (var i=0; i<instance.m_tanks[Enum.TEAM_1].length; i++) {
			instance.m_tanks[Enum.TEAM_1][i].Update();
		}
		for (var i=0; i<instance.m_tanks[Enum.TEAM_2].length; i++) {
			instance.m_tanks[Enum.TEAM_2][i].Update();
		}
		
		// Update all bullet
		for (var i=0; i<instance.m_bullets[Enum.TEAM_1].length; i++) {
			instance.m_bullets[Enum.TEAM_1][i].Update();
		}
		for (var i=0; i<instance.m_bullets[Enum.TEAM_2].length; i++) {
			instance.m_bullets[Enum.TEAM_2][i].Update();
		}
		
		// Update all runes
		for (var i = 0; i<instance.m_powerUps.length; i++) {
			instance.m_powerUps[i].Update();
		}
		
		// Update all strike
		for (var i=0; i<instance.m_strikes[Enum.TEAM_1].length; i++) {
			instance.m_strikes[Enum.TEAM_1][i].Update();
		}
		for (var i=0; i<instance.m_strikes[Enum.TEAM_2].length; i++) {
			instance.m_strikes[Enum.TEAM_2][i].Update();
		}
		
		var stateUpdatePacket = "";
		var matchResultPacket = "";
		if (instance.m_matchResult == Enum.MATCH_RESULT_NOT_FINISH) {
			//le.huathi - check win-lost if match isn't finished
			if ((instance.m_matchResult == Enum.MATCH_RESULT_NOT_FINISH) && (instance.CheckWinLost())) {
				instance.m_state = Enum.STATE_FINISHED;
				matchResultPacket = instance.GetMatchResultPackage();
				stateUpdatePacket = instance.GetStateUpdatePacket();
			}
			//Should turn on sudden death mode?
			else if ((instance.m_state == Enum.STATE_ACTION) && (instance.m_loopNumber >= Setting.LOOPS_SUDDEN_DEATH)) {
				if(!instance.CheckWinLost120s())
				{
					instance.SetSuddenDeathMode();
					stateUpdatePacket = instance.GetStateUpdatePacket();
				}
				else
				{
					instance.m_matchResult = (instance.m_loser[Enum.TEAM_1] == false) ? Enum.MATCH_RESULT_TEAM_1_WIN : Enum.MATCH_RESULT_TEAM_2_WIN;
					instance.m_state = Enum.STATE_FINISHED;
					matchResultPacket = instance.GetMatchResultPackage();
					stateUpdatePacket = instance.GetStateUpdatePacket();
				}
			}
			//or time's up?
			else if ((instance.m_state == Enum.STATE_SUDDEN_DEATH) && (instance.m_loopNumber >= Setting.LOOPS_MATCH_END)) {
				instance.ProcessTimeUp();
				matchResultPacket = instance.GetMatchResultPackage();
				stateUpdatePacket = instance.GetStateUpdatePacket();
			}
		}
		
		// Broadcast all that changed, and add a request control input from player here.
		var requestControlPacket = "";
		requestControlPacket += Network.EncodeUInt8(Enum.COMMAND_REQUEST_CONTROL);
		
		var updatePacket = instance.GetUpdatePacket(false);
		instance.Broadcast (stateUpdatePacket + updatePacket + requestControlPacket + matchResultPacket);
		
		instance.AddToReplay (stateUpdatePacket + updatePacket + matchResultPacket);
	}
	
	this.CheckWinLost = function() {
		var hasLoser = false;
		// Check bases
		for (var i=0; i<this.m_bases[Enum.TEAM_1].length; i++) {
			if ((this.m_bases[Enum.TEAM_1][i].m_type == Enum.BASE_MAIN) && (this.m_bases[Enum.TEAM_1][i].m_HP == 0)) {
				this.m_loser[Enum.TEAM_1] = true;
				hasLoser = true;
			}
		}
		for (var i=0; i<this.m_bases[Enum.TEAM_2].length; i++) {
			if ((this.m_bases[Enum.TEAM_2][i].m_type == Enum.BASE_MAIN) && (this.m_bases[Enum.TEAM_2][i].m_HP == 0)) {
				this.m_loser[Enum.TEAM_2] = true;
				hasLoser = true;
			}
		}
		if (hasLoser) {
			if (this.m_loser[Enum.TEAM_1] == this.m_loser[Enum.TEAM_2]) { //both team lost the main base
				if (this.CheckWinLostTimeUp()) {
					this.m_matchResult = (this.m_loser[Enum.TEAM_1] == false) ? Enum.MATCH_RESULT_TEAM_1_WIN : Enum.MATCH_RESULT_TEAM_2_WIN;
				}
				else {
					this.m_matchResult = Enum.MATCH_RESULT_DRAW;
				}
			}
			else if (this.m_loser[Enum.TEAM_1] == false) {
				this.m_matchResult = Enum.MATCH_RESULT_TEAM_1_WIN;
			}
			else {
				this.m_matchResult = Enum.MATCH_RESULT_TEAM_2_WIN;
			}
			return true;
		}
			
		// Check tanks
		var dieCount = 0;
		for (var i=0; i<this.m_tanks[Enum.TEAM_1].length; i++) {
			if (this.m_tanks[Enum.TEAM_1][i].m_HP == 0)
				dieCount++;
		}
		if (dieCount == this.m_tanks[Enum.TEAM_1].length) {
			//TEAM_1 lost!!!
			this.m_loser[Enum.TEAM_1] = true;
			hasLoser = true;
		}
		
		dieCount = 0;
		for (var i=0; i<this.m_tanks[Enum.TEAM_2].length; i++) {
			if (this.m_tanks[Enum.TEAM_2][i].m_HP == 0)
				dieCount++;
		}
		if (dieCount == this.m_tanks[Enum.TEAM_2].length) {
			//TEAM_1 lost!!!
			this.m_loser[Enum.TEAM_2] = true;
			hasLoser = true;
		}
		
		if (hasLoser) {
			if (this.m_loser[Enum.TEAM_1] == this.m_loser[Enum.TEAM_2]){
				if (this.CheckWinLostTimeUp())
					this.m_matchResult = (this.m_loser[Enum.TEAM_1] == false) ? Enum.MATCH_RESULT_TEAM_1_WIN : Enum.MATCH_RESULT_TEAM_2_WIN;
				else
					this.m_matchResult = Enum.MATCH_RESULT_DRAW;
			}
			else if (this.m_loser[Enum.TEAM_1] == false) {
				this.m_matchResult = Enum.MATCH_RESULT_TEAM_1_WIN;
			}
			else {
				this.m_matchResult = Enum.MATCH_RESULT_TEAM_2_WIN;
			}
			return true;
		}
			
		//Check win-lost in SuddenDeath mode
		if ((this.m_state == Enum.STATE_SUDDEN_DEATH) && (this.m_teamLostSuddenDeath != -1)) {
			if (this.m_loser[Enum.TEAM_1] && this.m_loser[Enum.TEAM_2]){ //both teams have base destroyed
				this.m_matchResult = Enum.MATCH_RESULT_DRAW;
			}
			else if (this.m_teamLostSuddenDeath == Enum.TEAM_1) {
				this.m_matchResult = Enum.MATCH_RESULT_TEAM_2_WIN;
			}
			else {
				this.m_matchResult = Enum.MATCH_RESULT_TEAM_1_WIN;
			}
			return true;
		}
		
		return false;
	}
	
	this.CheckWinLost120s = function() {
		//Check bases living
		var count1 = 0;
		var count2 = 0;
		for (var i=0; i<this.m_bases[Enum.TEAM_1].length; i++) {
			if (this.m_bases[Enum.TEAM_1][i].m_HP > 0) {
				count1++;
			}
		}
		for (var i=0; i<this.m_bases[Enum.TEAM_2].length; i++) {
			if (this.m_bases[Enum.TEAM_2][i].m_HP > 0) {
				count2++;
			}
		}
		
		if (count1 < count2) {
			//must set both values because function CheckWinLost need both
			this.m_loser[Enum.TEAM_1] = true;
			this.m_loser[Enum.TEAM_2] = false;
			return true;
		}
		else if (count1 > count2) {
			//must set both values because function CheckWinLost need both
			this.m_loser[Enum.TEAM_1] = false;
			this.m_loser[Enum.TEAM_2] = true;
			return true;
		}
		return false;
	}
	
	this.CheckWinLostTimeUp = function() {
		//Check bases living
		var count1 = 0;
		var count2 = 0;
		for (var i=0; i<this.m_bases[Enum.TEAM_1].length; i++) {
			if (this.m_bases[Enum.TEAM_1][i].m_HP > 0) {
				count1++;
			}
		}
		for (var i=0; i<this.m_bases[Enum.TEAM_2].length; i++) {
			if (this.m_bases[Enum.TEAM_2][i].m_HP > 0) {
				count2++;
			}
		}
		
		if (count1 < count2) {
			//must set both values because function CheckWinLost need both
			this.m_loser[Enum.TEAM_1] = true;
			this.m_loser[Enum.TEAM_2] = false;
			return true;
		}
		else if (count1 > count2) {
			//must set both values because function CheckWinLost need both
			this.m_loser[Enum.TEAM_1] = false;
			this.m_loser[Enum.TEAM_2] = true;
			return true;
		}
		
		//Same bases count -> check tanks living
		count1 = 0;
		count2 = 0;
		for (var i=0; i<this.m_tanks[Enum.TEAM_1].length; i++) {
			if (this.m_tanks[Enum.TEAM_1][i].m_HP > 0)
				count1++;
		}
		for (var i=0; i<this.m_tanks[Enum.TEAM_2].length; i++) {
			if (this.m_tanks[Enum.TEAM_2][i].m_HP > 0)
				count2++;
		}
		if (count1 < count2) {
			this.m_loser[Enum.TEAM_1] = true;
			this.m_loser[Enum.TEAM_2] = false;
			return true;
		}
		else if (count1 > count2) {
			this.m_loser[Enum.TEAM_1] = false;
			this.m_loser[Enum.TEAM_2] = true;
			return true;
		}
		
		//Still the same?
		return false;
	}
	
	this.ProcessTimeUp = function() {
		if (this.CheckWinLostTimeUp()) {
			this.m_matchResult = (this.m_loser[Enum.TEAM_1] == false) ? Enum.MATCH_RESULT_TEAM_1_WIN : Enum.MATCH_RESULT_TEAM_2_WIN;
			console.log("ProcessTimeUp, match result: " + this.m_matchResult);
		}
		else { //need more checking here, if no base or tank is destroyed -> DRAW_NEGATIVE
			var count = 0;
			for (var i=0; i<this.m_bases[Enum.TEAM_1].length; i++) {
				if (this.m_bases[Enum.TEAM_1][i].m_HP == 0)	{
					count++;
					break;
				}
			}
			for (var i=0; i<this.m_tanks[Enum.TEAM_1].length; i++) {
				if (this.m_tanks[Enum.TEAM_1][i].m_HP == 0)	{
					count++;
					break;
				}
			}
			if (count > 0) 	this.m_matchResult = Enum.MATCH_RESULT_DRAW;
			else			this.m_matchResult = Enum.MATCH_RESULT_BAD_DRAW;
			console.log("ProcessTimeUp case 2, match result: " + this.m_matchResult);
		}
		
		this.m_state = Enum.STATE_FINISHED;
	}
	
	this.SetSuddenDeathMode = function() {
		//Destroy all obstacles
		for (var i=0; i<this.m_obstacles.length; i++) {
			if (this.m_obstacles[i].m_HP > 0) {
				//console.log("Destroy obstacle (" + this.m_obstacles[i].m_x + "," + this.m_obstacles[i].m_y + ")");
				this.m_obstacles[i].m_HP = 0;
				this.m_obstacles[i].m_dirty = true;
				this.m_map[this.m_obstacles[i].m_y * Setting.MAP_W + this.m_obstacles[i].m_x] = Enum.BLOCK_GROUND;
			}
		}
		//change state
		this.m_state = Enum.STATE_SUDDEN_DEATH;
	}







	
	// ==================================================================
	// Helper functions
	// ==================================================================
	//le.huathi - get existing obstacle at cell (x,y)
	this.GetObstacle = function(x, y) {
		for (var i=0; i<this.m_obstacles.length; i++) {
			if ((this.m_obstacles[i].m_x == x) && (this.m_obstacles[i].m_y == y))
				return this.m_obstacles[i];
		}
		return null;
	}

	this.GetBase = function(x, y) {
		for (var i=0; i<this.m_bases[Enum.TEAM_1].length; i++) {
			if ((this.m_bases[Enum.TEAM_1][i].m_x - 1 < x) && (this.m_bases[Enum.TEAM_1][i].m_x + 1 > x) 
				&& (this.m_bases[Enum.TEAM_1][i].m_y - 1 < y) && (this.m_bases[Enum.TEAM_1][i].m_y + 1 > y))
				return this.m_bases[Enum.TEAM_1][i];
		}
		for (var i=0; i<this.m_bases[Enum.TEAM_2].length; i++) {
			if ((this.m_bases[Enum.TEAM_2][i].m_x - 1 < x) && (this.m_bases[Enum.TEAM_2][i].m_x + 1 > x) 
				&& (this.m_bases[Enum.TEAM_2][i].m_y - 1 < y) && (this.m_bases[Enum.TEAM_2][i].m_y + 1 > y))
				return this.m_bases[Enum.TEAM_2][i];
		}
		return null;
	}
	
	
	
	// ==================================================================
	// This part is for testing
	
	// ==================================================================
}