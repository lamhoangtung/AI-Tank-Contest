var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function Bullet (game, team, id) {
	// Position
	this.m_x = 0;
	this.m_y = 0;
	
	// Properties
	this.m_id = id;
	this.m_team = team;
	this.m_type = Enum.TANK_MEDIUM;
	this.m_direction = Enum.DIRECTION_UP;
	
	// Status
	this.m_speed = 0;
	this.m_damage = 0;
	
	// Projectile active?
	this.m_live = false;
	
	this.m_needToAnnounceHit = false;
	
	
	this.Fire = function(x, y, type, direction) {
		this.m_x = x;
		this.m_y = y;
		this.m_type = type;
		this.m_direction = direction;
		this.m_live = true;
		this.m_speed = Setting.BULLET_SPEED [this.m_type];
		this.m_damage = Setting.TANK_DAMAGE [this.m_type];
	}
	
	// Called by the server to update based on command
	this.Update = function() {
		if (this.m_live) {
			// Because tank get to move first in a loop, some tanks could have slammed into this bullet
			this.CheckCollisionWithTank();
			
			// No tank slammed into the bullet
			if (this.m_live) {
				if (this.m_speed > 1) {
					if (this.m_direction == Enum.DIRECTION_UP) {
						this.m_y = this.m_y - 1;
					}
					else if (this.m_direction == Enum.DIRECTION_DOWN) {
						this.m_y = this.m_y + 1;
					}
					else if (this.m_direction == Enum.DIRECTION_LEFT) {
						this.m_x = this.m_x - 1;
					}
					else if (this.m_direction == Enum.DIRECTION_RIGHT) {
						this.m_x = this.m_x + 1;
					}
				}
				else {
					if (this.m_direction == Enum.DIRECTION_UP) {
						this.m_y = this.m_y - this.m_speed;
					}
					else if (this.m_direction == Enum.DIRECTION_DOWN) {
						this.m_y = this.m_y + this.m_speed;
					}
					else if (this.m_direction == Enum.DIRECTION_LEFT) {
						this.m_x = this.m_x - this.m_speed;
					}
					else if (this.m_direction == Enum.DIRECTION_RIGHT) {
						this.m_x = this.m_x + this.m_speed;
					}
				}
				
				// Check to see if that position is valid (no collision)
				this.CheckForCollision();
				
				
				if (this.m_speed > 1 && this.m_live == true) {
					if (this.m_direction == Enum.DIRECTION_UP) {
						this.m_y = this.m_y - (this.m_speed - 1);
					}
					else if (this.m_direction == Enum.DIRECTION_DOWN) {
						this.m_y = this.m_y + (this.m_speed - 1);
					}
					else if (this.m_direction == Enum.DIRECTION_LEFT) {
						this.m_x = this.m_x - (this.m_speed - 1);
					}
					else if (this.m_direction == Enum.DIRECTION_RIGHT) {
						this.m_x = this.m_x + (this.m_speed - 1);
					}
					this.CheckForCollision();
				}
			}
		}
	}
	
	this.CheckForCollision = function () {
		// Check collision with opponent's tanks.
		var oppTeam = (this.m_team == Enum.TEAM_2) ? Enum.TEAM_1 : Enum.TEAM_2;
		for (var i=0; i<game.m_tanks[oppTeam].length; i++) {
			var tempTank = game.m_tanks[oppTeam][i];
			if (tempTank.m_HP > 0) {
				if (Math.abs(this.m_x - tempTank.m_x) <= 0.5 && Math.abs(this.m_y - tempTank.m_y) <= 0.5) {
					this.m_live = false;
					this.m_needToAnnounceHit = true;
					//le.huathi - update tank's HP
					tempTank.Hit(this.m_damage);
					return;
				}
			}
		}
		
		// Check landscape
		var checkX = 1;
		var checkY = 1;
		var roundedX = (this.m_x + 0.499) >> 0;
		var roundedY = (this.m_y + 0.499) >> 0;
		
		if (this.m_x % 1 > 0.49999 && this.m_x % 1 < 0.50001) {
			checkX = 2;
		}
		if (this.m_y % 1 > 0.49999 && this.m_y % 1 < 0.50001) {
			checkY = 2;
		}
		
		for (var i=0; i<checkX; i++) {
			for (var j=0; j<checkY; j++) {
				var tempX = roundedX + i;
				var tempY = roundedY + j;
				
				if (game.m_map[tempY * Setting.MAP_W + tempX] == Enum.BLOCK_BASE) 
				{
					this.m_needToAnnounceHit = true;
					this.m_live = false;
					base = game.GetBase(tempX, tempY);
					if(base != null) {
						base.Hit(this.m_damage);
					}
					return;
				}
			}
		}
		
		for (var i=0; i<checkX; i++) {
			for (var j=0; j<checkY; j++) {
				var tempX = roundedX + i;
				var tempY = roundedY + j;
				
				if (game.m_map[tempY * Setting.MAP_W + tempX] == Enum.BLOCK_HARD_OBSTACLE
					||  game.m_map[tempY * Setting.MAP_W + tempX] == Enum.BLOCK_SOFT_OBSTACLE) 
				{
					this.m_needToAnnounceHit = true;
					this.m_live = false;
					if(game.m_map[tempY * Setting.MAP_W + tempX] == Enum.BLOCK_SOFT_OBSTACLE) {
						obstacle = game.GetObstacle(tempX, tempY);
						if(obstacle != null) {
							obstacle.Hit(this.m_damage);
						}
					}
					return;
				}
			}
		}
		
	}
	
	this.CheckCollisionWithTank = function () {
		// Check collision with opponent's tanks.
		var oppTeam = (this.m_team == Enum.TEAM_2) ? Enum.TEAM_1 : Enum.TEAM_2;
		for (var i=0; i<game.m_tanks[oppTeam].length; i++) {
			var tempTank = game.m_tanks[oppTeam][i];
			if (tempTank.m_HP > 0) {
				if (Math.abs(this.m_x - tempTank.m_x) <= 0.5 && Math.abs(this.m_y - tempTank.m_y) <= 0.5) {
					this.m_live = false;
					this.m_needToAnnounceHit = true;
					//le.huathi - update tank's HP
					tempTank.Hit(this.m_damage);
					return;
				}
			}
		}
	}
	
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (this.m_live || this.m_needToAnnounceHit || forceUpdate) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_BULLET);
			packet += Network.EncodeUInt8(this.m_id);
			packet += Network.EncodeUInt8(this.m_live);
			packet += Network.EncodeUInt8(this.m_team);
			packet += Network.EncodeUInt8(this.m_type);
			packet += Network.EncodeUInt8(this.m_direction);
			packet += Network.EncodeFloat32(this.m_speed);
			packet += Network.EncodeUInt8(this.m_damage);
			packet += Network.EncodeUInt8(this.m_needToAnnounceHit);
			packet += Network.EncodeFloat32(this.m_x);
			packet += Network.EncodeFloat32(this.m_y);
			
			if (!this.m_live) {
				this.m_needToAnnounceHit = false;
			}
		}
		return packet;
	}
}