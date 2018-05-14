function Base (game, id, team, type) {
	var BASE_MAX_HP = new Array();
	BASE_MAX_HP [BASE_MAIN] = 400;
	BASE_MAX_HP [BASE_SIDE] = 200;
	
	var HP_BAR_OFFSET = -5;
	
	// Identifier
	this.m_id = id;
	this.m_team = team;
	this.m_type = type;
	
	// An array to contain state in the past
	function DataAnchor() {
		this.m_x = 0;
		this.m_y = 0;
		this.m_HP = 0;
	}
	this.m_data = new Array();
	
	// Current state
	this.m_x = -1;
	this.m_y = -1;
	this.m_HP = 0;
	
	// Local variable
	// Indicate if the object is updated by a packet
	var dirty = false;
	var shouldDraw = true;
	
	// Image
	var imgBase = new Array();
	imgBase[TEAM_1] = new Array();
	imgBase[TEAM_2] = new Array();
	imgBase[TEAM_1][BASE_MAIN]	= g_graphicEngine.LoadImage("Image/Base/Team 1/MainBase.png");
	imgBase[TEAM_1][BASE_SIDE]	= g_graphicEngine.LoadImage("Image/Base/Team 1/SideBase.png");
	imgBase[TEAM_2][BASE_MAIN]	= g_graphicEngine.LoadImage("Image/Base/Team 2/MainBase.png");
	imgBase[TEAM_2][BASE_SIDE]	= g_graphicEngine.LoadImage("Image/Base/Team 2/SideBase.png");
	
	var imgBaseD = new Array();
	imgBaseD[TEAM_1] = new Array();
	imgBaseD[TEAM_2] = new Array();
	imgBaseD[TEAM_1][BASE_MAIN]	= g_graphicEngine.LoadImage("Image/Base/Team 1/MainBaseD.png");
	imgBaseD[TEAM_1][BASE_SIDE]	= g_graphicEngine.LoadImage("Image/Base/Team 1/SideBaseD.png");
	imgBaseD[TEAM_2][BASE_MAIN]	= g_graphicEngine.LoadImage("Image/Base/Team 2/MainBaseD.png");
	imgBaseD[TEAM_2][BASE_SIDE]	= g_graphicEngine.LoadImage("Image/Base/Team 2/SideBaseD.png");
	
	// Add a state in a specific time
	this.AddDataAnchor = function (time, x, y, HP) {
		var tempAnchor = new DataAnchor();
		tempAnchor.m_time = time;
		tempAnchor.m_x = x;
		tempAnchor.m_y = y;
		tempAnchor.m_HP = HP;
		
		// Check previous data node.
		if (this.m_data.length > 0) {
			var previousAnchor = this.m_data[this.m_data.length-1];
			
			// Suddenly, the tank HP go to 0. It must have been killed.
			// We'll create a small explosion here.
			if (previousAnchor.m_HP > 0 && tempAnchor.m_HP == 0) {
				game.SpawnExplosion (time, EXPLOSION_TANK, tempAnchor.m_x + 0.5, tempAnchor.m_y + 0.5);
				for (var i=1; i<10; i++) {
					game.SpawnExplosion (time + i*2, EXPLOSION_TANK, tempAnchor.m_x + 0.5 + Math.random() * 2 - 1, tempAnchor.m_y + 0.5 + Math.random() * 2 - 1);
				}
			}
		}
		
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
				tempAnchor.m_HP = previousAnchor.m_HP;
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
			this.m_HP = prevAnchor.m_HP;
			
			shouldDraw = true;
		}
		else {
			shouldDraw = false;
		}
	}
	
	this.Draw = function () {
		if (shouldDraw) {
			if(this.m_HP > 0) {
				g_graphicEngine.DrawFast (g_context, imgBase[this.m_team][this.m_type], this.m_x * BLOCK_SIZE - BLOCK_SIZE/2 + g_gsActionPhase.m_screenShakeX , this.m_y * BLOCK_SIZE - BLOCK_SIZE/2 + g_gsActionPhase.m_screenShakeY);
				g_graphicEngine.FillCanvas (g_context, 192, 0, 0, 1, this.m_x * BLOCK_SIZE - BLOCK_SIZE/2 + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE - BLOCK_SIZE/2 + g_gsActionPhase.m_screenShakeY + HP_BAR_OFFSET, BLOCK_SIZE * 2, 4);
				g_graphicEngine.FillCanvas (g_context, 0, 192, 0, 1, this.m_x * BLOCK_SIZE - BLOCK_SIZE/2 + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE - BLOCK_SIZE/2 + g_gsActionPhase.m_screenShakeY + HP_BAR_OFFSET, BLOCK_SIZE * 2 * (this.m_HP / BASE_MAX_HP[this.m_type]), 4);
			}
			else {
				g_graphicEngine.DrawFast (g_context, imgBaseD[this.m_team][this.m_type], this.m_x * BLOCK_SIZE - BLOCK_SIZE/2 + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE - BLOCK_SIZE/2 + g_gsActionPhase.m_screenShakeY);
			}
		}
	}
}