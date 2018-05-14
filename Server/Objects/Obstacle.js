var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function Obstacle (game, id, x, y) {
	// Position
	this.m_id = id;
	this.m_x = x;
	this.m_y = y;

	// Status
	this.m_HP = Setting.OBSTACLE_HP;
	
	// Need to update or not
	this.m_dirty = false;

	this.Hit = function(damage) {
		this.m_HP -= damage;
		this.m_dirty = true;
		if (this.m_HP <= 0) {
			// BOOM!
			this.m_HP = 0;
			game.m_map[this.m_y * Setting.MAP_W + this.m_x] = Enum.BLOCK_GROUND;
		}
	}
	
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (this.m_dirty || forceUpdate) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_OBSTACLE);
			packet += Network.EncodeUInt8(this.m_id);
			packet += Network.EncodeUInt8(this.m_x);
			packet += Network.EncodeUInt8(this.m_y);
			packet += Network.EncodeUInt8(this.m_HP);
			
			this.m_dirty = false;
		}
		
		return packet;
	}
}