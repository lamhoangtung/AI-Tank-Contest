var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function Strike (game, id, team) {
	// Properties
	this.m_id = id;
	this.m_team = team;
	this.m_type = Enum.POWERUP_AIRSTRIKE;

	this.m_x = 0;
	this.m_y = 0;
	this.m_countDown = 0;
	this.m_living = false;
	this.m_needToUpdateLastPacket = false;

	// Spawn it
	this.Spawn = function (type, x, y) {
		if (!this.m_living) {
			this.m_x = x;
			this.m_y = y;
			this.m_type = type;
			this.m_countDown = Setting.POWERUP_DELAY[type];
			this.m_living = true;
		}
	}
	
	this.Update = function () {
		if (this.m_living) {
			if (this.m_countDown > 0) {
				this.m_countDown--;
			}
			else {
				// Strike here
				this.m_living = false;
				this.m_needToUpdateLastPacket = true;
				
				if (this.m_type == Enum.POWERUP_AIRSTRIKE) {
					for (var i=0; i<game.m_tanks[Enum.TEAM_1].length; i++) {
						var tempTank = game.m_tanks[Enum.TEAM_1][i];
						if (tempTank.m_HP > 0) {
							if ((this.m_x - tempTank.m_x) * (this.m_x - tempTank.m_x) + (this.m_y - tempTank.m_y) * (this.m_y - tempTank.m_y) <= Setting.AIRSTRIKE_AOE * Setting.AIRSTRIKE_AOE) {
								tempTank.Hit(Setting.AIRSTRIKE_DAMAGE);
							}
						}
					}
					for (var i=0; i<game.m_tanks[Enum.TEAM_2].length; i++) {
						var tempTank = game.m_tanks[Enum.TEAM_2][i];
						if (tempTank.m_HP > 0) {
							if ((this.m_x - tempTank.m_x) * (this.m_x - tempTank.m_x) + (this.m_y - tempTank.m_y) * (this.m_y - tempTank.m_y) <= Setting.AIRSTRIKE_AOE * Setting.AIRSTRIKE_AOE) {
								tempTank.Hit(Setting.AIRSTRIKE_DAMAGE);
							}
						}
					}
					
					for (var i=0; i<game.m_obstacles.length; i++) {
						var tempObstacle = game.m_obstacles[i];
						if (tempObstacle.m_HP > 0) {
							if ((this.m_x - tempObstacle.m_x) * (this.m_x - tempObstacle.m_x) + (this.m_y - tempObstacle.m_y) * (this.m_y - tempObstacle.m_y) <= Setting.AIRSTRIKE_AOE * Setting.AIRSTRIKE_AOE) {
								tempObstacle.Hit(Setting.AIRSTRIKE_DAMAGE);
							}
						}
					}
					
					for (var i=0; i<game.m_bases[Enum.TEAM_1].length; i++) {
						var tempBase = game.m_bases[Enum.TEAM_1][i];
						if (tempBase.m_HP > 0) {
							if ((this.m_x - tempBase.m_x) * (this.m_x - tempBase.m_x) + (this.m_y - tempBase.m_y) * (this.m_y - tempBase.m_y) <= (Setting.AIRSTRIKE_AOE + 1) * (Setting.AIRSTRIKE_AOE + 1)) {
								tempBase.Hit(Setting.AIRSTRIKE_DAMAGE);
							}
						}
					}
					for (var i=0; i<game.m_bases[Enum.TEAM_2].length; i++) {
						var tempBase = game.m_bases[Enum.TEAM_2][i];
						if (tempBase.m_HP > 0) {
							if ((this.m_x - tempBase.m_x) * (this.m_x - tempBase.m_x) + (this.m_y - tempBase.m_y) * (this.m_y - tempBase.m_y) <= (Setting.AIRSTRIKE_AOE + 1) * (Setting.AIRSTRIKE_AOE + 1)) {
								tempBase.Hit(Setting.AIRSTRIKE_DAMAGE);
							}
						}
					}
				}
				else if (this.m_type == Enum.POWERUP_EMP) {
					for (var i=0; i<game.m_tanks[Enum.TEAM_1].length; i++) {
						var tempTank = game.m_tanks[Enum.TEAM_1][i];
						if (tempTank.m_HP > 0) {
							if ((this.m_x - tempTank.m_x) * (this.m_x - tempTank.m_x) + (this.m_y - tempTank.m_y) * (this.m_y - tempTank.m_y) <= Setting.EMP_AOE * Setting.EMP_AOE) {
								tempTank.EMP(Setting.EMP_DURATION);
							}
						}
					}
					for (var i=0; i<game.m_tanks[Enum.TEAM_2].length; i++) {
						var tempTank = game.m_tanks[Enum.TEAM_2][i];
						if (tempTank.m_HP > 0) {
							if ((this.m_x - tempTank.m_x) * (this.m_x - tempTank.m_x) + (this.m_y - tempTank.m_y) * (this.m_y - tempTank.m_y) <= Setting.EMP_AOE * Setting.EMP_AOE) {
								tempTank.EMP(Setting.EMP_DURATION);
							}
						}
					}
				}
			}
		}
	}
	
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (this.m_living || forceUpdate || this.m_needToUpdateLastPacket) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_STRIKE);
			packet += Network.EncodeUInt8(this.m_id);
			packet += Network.EncodeUInt8(this.m_team);
			packet += Network.EncodeUInt8(this.m_type);
			packet += Network.EncodeUInt8(this.m_living);
			packet += Network.EncodeUInt8(this.m_countDown);
			packet += Network.EncodeFloat32(this.m_x);
			packet += Network.EncodeFloat32(this.m_y);
			
			if (this.m_needToUpdateLastPacket) {
				this.m_needToUpdateLastPacket = false;
			}
		}
		
		return packet;
	}
}