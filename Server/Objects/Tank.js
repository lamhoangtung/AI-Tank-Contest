var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function Tank (game, id, x, y, team, type) {
	// Position
	this.m_x = x;
	this.m_y = y;
	
	// Properties
	this.m_id = id;
	this.m_team = team; //Enum.TEAM_1;
	this.m_type = type; //Enum.TANK_MEDIUM;
	
	// Status
	this.m_HP = Setting.TANK_HP [this.m_type];
	if (this.m_team == Enum.TEAM_1) {
		this.m_direction = Enum.DIRECTION_RIGHT;
	}
	else {
		this.m_direction = Enum.DIRECTION_LEFT;
	}
	this.m_speed = Setting.TANK_SPEED [this.m_type];
	this.m_rateOfFire = Setting.TANK_ROF [this.m_type];
	this.m_coolDown = 0; // Cooldown = 0 and the tank is allowed to shoot again.
	this.m_damage = Setting.TANK_DAMAGE [this.m_type];
	this.m_disabled = 0;
	
	// Need to update or not
	this.m_dirty = false;
	
	
	
	var commandTurn = -1;
	var commandMove = false;
	var commandShoot = false;
	
	// Called by the client
	this.Turn = function(direction) {
		commandTurn = direction;
	}
	this.Move = function() {
		commandMove = true;
	}
	this.Shoot = function() {
		commandShoot = true;
	}
	
	// Called by the server to update based on command
	this.Update = function() {
		if (this.m_HP > 0) {
			if (this.m_disabled <= 0) {
				if (commandTurn == Enum.DIRECTION_DOWN || commandTurn == Enum.DIRECTION_RIGHT
				||  commandTurn == Enum.DIRECTION_LEFT || commandTurn == Enum.DIRECTION_UP) {
					this.m_direction = commandTurn;
					this.m_dirty = true;
				}
				
				if (commandMove) {
					// Move the tank to an imaginary position first
					var newX = this.m_x;
					var newY = this.m_y;
					var newPositionOK = false;
					if (this.m_direction == Enum.DIRECTION_UP) {
						newY = this.m_y - this.m_speed;
					}
					else if (this.m_direction == Enum.DIRECTION_DOWN) {
						newY = this.m_y + this.m_speed;
					}
					else if (this.m_direction == Enum.DIRECTION_LEFT) {
						newX = this.m_x - this.m_speed;
					}
					else if (this.m_direction == Enum.DIRECTION_RIGHT) {
						newX = this.m_x + this.m_speed;
					}
					
					// Round up on a square, because, in javascript, sometimes:
					// 0.2 + 0.2 + 0.2 + 0.2 + 0.2 = 0.9999999...
					// Lol... ^^
					if (newX % 1 < 0.05) newX = (newX >> 0);
					if (newX % 1 > 0.95) newX = (newX >> 0) + 1;
					if (newY % 1 < 0.05) newY = (newY >> 0);
					if (newY % 1 > 0.95) newY = (newY >> 0) + 1;
					
					// Check to see if that position is valid (no collision)
					newPositionOK = this.CheckForCollision(newX, newY);

					// Update if OK.
					if (newPositionOK) {
						this.m_x = newX;
						this.m_y = newY;
						this.m_dirty = true;
					}
				}
				
				if (commandShoot) {
					if (this.m_HP > 0) {
						if (this.m_coolDown == 0) {
							this.m_coolDown = this.m_rateOfFire;
							game.Fire (this);
						}
					}
				}
			}
			else {
				this.m_disabled --;
				if (this.m_disabled == 0) {
					this.m_dirty = true;
				}
			}
			
			// Reset all command
			commandTurn = -1;
			commandMove = false;
			commandShoot = false;
			
			// Internal stuff
			if (this.m_coolDown > 0 && this.m_disabled <= 0) {
				this.m_coolDown --;
			}
		}
		else {
			//le.huathi - reset m_dirty if already died last frame
			if (this.m_dirty) {
				this.m_dirty = false;
			}
		}
	}
	
	this.CheckForCollision = function (newX, newY) {
		// Check landscape
		var roundedX = newX >> 0;
		var roundedY = newY >> 0;
		var squareNeedToCheckX = new Array();
		var squareNeedToCheckY = new Array();
		
		// Find the square the tank occupy (even part of)
		if (newX == roundedX && newY == roundedY) {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
		}
		else if (newX != roundedX && newY == roundedY) {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX+1); squareNeedToCheckY.push (roundedY);
		}
		else if (newX == roundedX && newY != roundedY) {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY+1);
		}
		else if (newX != roundedX && newY != roundedY) {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX+1); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY+1);
			squareNeedToCheckX.push (roundedX+1); squareNeedToCheckY.push (roundedY+1);
		}
		
		// Check if that square is invalid
		for (var i=0; i<squareNeedToCheckX.length; i++) {
			var x = squareNeedToCheckX[i];
			var y = squareNeedToCheckY[i];
			if (game.m_map[y * Setting.MAP_W + x] == Enum.BLOCK_WATER
			||  game.m_map[y * Setting.MAP_W + x] == Enum.BLOCK_HARD_OBSTACLE
			||  game.m_map[y * Setting.MAP_W + x] == Enum.BLOCK_SOFT_OBSTACLE
			||  game.m_map[y * Setting.MAP_W + x] == Enum.BLOCK_BASE) {
				return false;
			}
		}
		
		// If landscape is valid, time to check collision with other tanks.
		for (var i=0; i<game.m_tanks[Enum.TEAM_1].length; i++) {
			if (this.m_team == Enum.TEAM_1 && this.m_id == i) {
				continue;
			}
			var tempTank = game.m_tanks[Enum.TEAM_1][i];
			if (Math.abs(newX - tempTank.m_x) < 1 && Math.abs(newY - tempTank.m_y) < 1) {
				return false;
			}
		}
		for (var i=0; i<game.m_tanks[Enum.TEAM_2].length; i++) {
			if (this.m_team == Enum.TEAM_2 && this.m_id == i) {
				continue;
			}
			var tempTank = game.m_tanks[Enum.TEAM_2][i];
			if (Math.abs(newX - tempTank.m_x) < 1 && Math.abs(newY - tempTank.m_y) < 1) {
				return false;
			}
		}
		
		return true;
	}
	
	//le.huathi - call this when tank meet opponent's bullet
	this.Hit = function(damage) {
		if(this.m_HP == 0) //do nothing if already died
			return;
		this.m_HP -= damage;
		this.m_dirty = true;
		if (this.m_HP <= 0) {
			// BOOM!
			this.m_HP = 0;
		}
	}
	
	this.EMP = function(duration) {
		if(this.m_HP == 0) //do nothing if already died
			return;
		this.m_disabled = duration;
		this.m_dirty = true;
	}
	
	// tien.dinhvan - call this when tank picks a rune
	this.PickRune = function(rune) {
		rune.m_state = this.m_team;
	}
	
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (this.m_dirty || forceUpdate) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_TANK);
			packet += Network.EncodeUInt8(this.m_id);
			packet += Network.EncodeUInt8(this.m_team);
			packet += Network.EncodeUInt8(this.m_type);
			packet += Network.EncodeUInt16(this.m_HP);
			packet += Network.EncodeUInt8(this.m_direction);
			packet += Network.EncodeFloat32(this.m_speed);
			packet += Network.EncodeUInt8(this.m_rateOfFire);
			packet += Network.EncodeUInt8(this.m_coolDown);
			packet += Network.EncodeUInt8(this.m_damage);
			packet += Network.EncodeUInt8(this.m_disabled);
			packet += Network.EncodeFloat32(this.m_x);
			packet += Network.EncodeFloat32(this.m_y);
			
			this.m_dirty = false;
		}
		return packet;
	}
}