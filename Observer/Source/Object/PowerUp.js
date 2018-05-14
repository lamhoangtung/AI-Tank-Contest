function PowerUp (game, id) {
	// Identifier
	this.m_id = id;
	
	// An array to contain state in the past
	function DataAnchor() {
		this.m_x = 0;
		this.m_y = 0;
		this.m_active = 0;
		this.m_type = 0;
	}
	this.m_data = new Array();
	
	this.m_x = 0;
	this.m_y = 0;
	this.m_active = 0;
	this.m_type = 0;
	
	var imgPowerUp = new Array();
	imgPowerUp[POWERUP_AIRSTRIKE] = g_graphicEngine.LoadImage("Image/PowerUp/Airstrike.png");
	imgPowerUp[POWERUP_EMP] = g_graphicEngine.LoadImage("Image/PowerUp/EMP.png");
	
	// Add a state in a specific time
	this.AddDataAnchor = function (time, x, y, active, type) {
		var tempAnchor = new DataAnchor();
		tempAnchor.m_time = time;
		tempAnchor.m_x = x;
		tempAnchor.m_y = y;
		tempAnchor.m_active = active;
		tempAnchor.m_type = type;
		this.m_data.push (tempAnchor);
		
		dirty = true;
	}

	// Clone a new state, at a new time, but with old data like previous state
	// This process to make a contiuous timeline. You can think of it as a fake update
	// We won't do it if was updated by a real packet.
	this.AddIdleDataAnchor = function (time) {
		if (!dirty) {
			var previousAnchor = this.m_data[this.m_data.length-1];
			
			if (previousAnchor) {
				var tempAnchor = new DataAnchor();
				tempAnchor.m_time = time;
				tempAnchor.m_x = previousAnchor.m_x;
				tempAnchor.m_y = previousAnchor.m_y;
				tempAnchor.m_active = previousAnchor.m_active;
				tempAnchor.m_type = previousAnchor.m_type;
				this.m_data.push (tempAnchor);
			}
		}
		else {
			dirty = false;
		}
	}
	// Update function, called with a specific moment in the timeline
	// We gonna interpolate all state, based on the data anchors.
	this.Update = function (time) {
		var prevAnchor = null;
		
		for (var i=0; i<this.m_data.length-1; i++) {
			if (time >= this.m_data[i].m_time && time < this.m_data[i+1].m_time) {
				prevAnchor = this.m_data[i];
				break;
			}
		}
		
		if (prevAnchor) {
			this.m_x = prevAnchor.m_x;
			this.m_y = prevAnchor.m_y;
			this.m_active = prevAnchor.m_active;
			this.m_type = prevAnchor.m_type;
		}
		else {
			this.m_active = 0;
		}
	}
	
	// Draw - obvious comment is obvious
	this.Draw = function () {
		if (this.m_active) {
		    g_graphicEngine.DrawFast (g_context, imgPowerUp[this.m_type], this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY);
		}
	}
}