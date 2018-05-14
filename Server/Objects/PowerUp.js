var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function PowerUp (game, id) {
	// Position
	this.m_id = id;
	this.m_x = 0;
	this.m_y = 0;
	this.m_type = 0;
	this.m_active = 0;
    
	// Need to update or not
	this.m_dirty = false;
	
	var spawnPoint = Setting.POWERUP_SPAWN_POINT;
	var spawnType = [Enum.POWERUP_AIRSTRIKE, Enum.POWERUP_EMP];
	
	this.Spawn = function () {
		// Get available spawning point
		var availableSpawnPoint = [];
		for (var i=0; i<spawnPoint.length; i++) {
			var takeThisPoint = true;
			for (var j=0; j<game.m_powerUps.length; j++) {
				if (game.m_powerUps[j].m_x == spawnPoint[i][0] && game.m_powerUps[j].m_y == spawnPoint[i][1]) {
					takeThisPoint = false;
					break;
				}
			}
			
			if (takeThisPoint) {
				availableSpawnPoint.push (spawnPoint[i]);
			}
		}
		
		// If there are free slots, random from those slots
		if (availableSpawnPoint.length > 0) {
			var slot = (Math.random() * availableSpawnPoint.length) >> 0;
			this.m_x = availableSpawnPoint[slot][0];
			this.m_y = availableSpawnPoint[slot][1];
			
			// Get a random type
			this.m_type = spawnType[(Math.random() * spawnType.length) >> 0];
			
			// Mark to announce its appearance
			this.m_active = 1;
			this.m_dirty = true;
		}
	}
    
    this.CheckForCollision = function () {
		var team1Number = 0;
		var team2Number = 0;
		
        // Check collision with any tanks.
        for (var i=0; i < game.m_tanks[Enum.TEAM_1].length; i++) {
            var tempTank = game.m_tanks[Enum.TEAM_1][i]; 
			if (tempTank == null || tempTank.m_HP == 0) continue;
            if (Math.abs(this.m_x - tempTank.m_x) < 1 && Math.abs(this.m_y - tempTank.m_y) < 1) {
				team1Number ++;
            }
        }
		
        for (var i=0; i < game.m_tanks[Enum.TEAM_2].length; i++) {
            var tempTank = game.m_tanks[Enum.TEAM_2][i]; 
			if (tempTank == null || tempTank.m_HP == 0) continue;
            if (Math.abs(this.m_x - tempTank.m_x) < 1 && Math.abs(this.m_y - tempTank.m_y) < 1) {
				team2Number ++;
            }
        }
		
		if (team1Number > team2Number) {
			this.m_active = 0;
			this.m_dirty = true;
			this.m_x = -1;
			this.m_y = -1;
			
			game.AcquirePowerup (Enum.TEAM_1, this.m_type);
		}
		else if (team2Number > team1Number) {
			this.m_active = 0;
			this.m_dirty = true;
			this.m_x = -1;
			this.m_y = -1;
			
			game.AcquirePowerup (Enum.TEAM_2, this.m_type);
		}
    }
	
	this.Update = function() {
		if (this.m_active == 1) {
			this.CheckForCollision();
		}
	}
    
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (this.m_dirty || forceUpdate) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_POWERUP);
			packet += Network.EncodeUInt8(this.m_id);
            packet += Network.EncodeUInt8(this.m_active);
			packet += Network.EncodeUInt8(this.m_type);
			packet += Network.EncodeFloat32(this.m_x);
			packet += Network.EncodeFloat32(this.m_y);
			
			this.m_dirty = false;
		}
		
		return packet;
	} 
} 
