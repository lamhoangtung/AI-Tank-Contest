var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function Base (game, id, x, y, team, type) {
	// Position
	this.m_id = id;
	this.m_x = x;
	this.m_y = y;
	this.m_team = team;
	this.m_type = type;

	// Status
	this.m_HP = Setting.BASE_HP[this.m_type];
	
	// Need to update or not
	this.m_dirty = false;

	this.Hit = function(damage) {
		if (this.m_HP == 0) //avoid base still be hit after destroyed
			return;
			
		this.m_HP -= damage;
		if (this.m_HP <= 0) {
			// BOOM!
			this.m_HP = 0;
			
			//if base lost in sudden death mode -> team lost
			if(game.m_state == Enum.STATE_SUDDEN_DEATH)
			{
				game.m_teamLostSuddenDeath = this.m_team;
				game.m_loser[this.m_team] = true;
			}
		}
		
		this.m_dirty = true;
	}
	
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (this.m_dirty || forceUpdate) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_BASE);
			packet += Network.EncodeUInt8(this.m_id);
			packet += Network.EncodeUInt8(this.m_team);
			packet += Network.EncodeUInt8(this.m_type);
			packet += Network.EncodeUInt16(this.m_HP);
			packet += Network.EncodeFloat32(this.m_x);
			packet += Network.EncodeFloat32(this.m_y);
			
			this.m_dirty = false;
		}
		
		return packet;
	}
}