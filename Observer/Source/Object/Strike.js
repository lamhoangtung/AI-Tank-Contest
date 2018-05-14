function Strike (game, id, team) {
	var AIRPLANE_OFFSET = -50;
	var AIRPLANE_SPRITE_SIZE = 250;
	var AIRPLANE_SMOKE_OFFSET_X_1 = 35;
	var AIRPLANE_SMOKE_OFFSET_Y_1 = 95;
	var AIRPLANE_SMOKE_OFFSET_X_2 = 105;
	var AIRPLANE_SMOKE_OFFSET_Y_2 = 95;
	
	var AIRSTRIKE_COUNTDOWN = 10;
	
	// Identifier
	this.m_id = id;
	this.m_team = team;
	
	// An array to contain state in the past
	function DataAnchor() {
		this.m_time = 0;
		this.m_type = 0;
		this.m_x = 0;
		this.m_y = 0;
		this.m_countDown = 0;
		this.m_live = false;
	}
	this.m_data = new Array();
	
	// Current state
	this.m_type = 0;
	this.m_x = -1;
	this.m_y = -1;
	this.m_countDown = 0;
	this.m_live = false;
	
	// Local variable
	// Indicate if the object is updated by a packet
	var dirty = false;
	
	// Image
	var imgAirPlane = new Array();
	imgAirPlane[TEAM_1] = g_graphicEngine.LoadImage("Image/PowerUp/Airplane 1.png");
	imgAirPlane[TEAM_2] = g_graphicEngine.LoadImage("Image/PowerUp/Airplane 2.png");

	// Particle for the air plane
	var whiteSmoke = new Array();
	whiteSmoke[0] = g_particleDef.CreatePlaneSmokeEmitter();
	whiteSmoke[0].m_x = 0;
	whiteSmoke[0].m_y = 0;
	whiteSmoke[1] = g_particleDef.CreatePlaneSmokeEmitter();
	whiteSmoke[1].m_x = 0;
	whiteSmoke[1].m_y = 0;
	
	var sndPlane = g_soundEngine.LoadSound("Sound/Airstrike.mp3", 5, 100);
	
	// Add a state in a specific time
	this.AddDataAnchor = function (time, type, x, y, countDown, live) {
		var tempAnchor = new DataAnchor();
		tempAnchor.m_time = time;
		tempAnchor.m_type = type;
		tempAnchor.m_x = x;
		tempAnchor.m_y = y;
		tempAnchor.m_countDown = countDown;
		tempAnchor.m_live = live;
		
		if (tempAnchor.m_type == POWERUP_AIRSTRIKE && countDown == 0) {
			game.SpawnExplosion (time, EXPLOSION_TANK, tempAnchor.m_x, tempAnchor.m_y );
			for (var i=1; i<5; i++) {
				game.SpawnExplosion (time + i, EXPLOSION_TANK, tempAnchor.m_x + Math.random() * 3 - 1.5, tempAnchor.m_y + Math.random() * 3 - 1.5);
			}
		}
		else if (tempAnchor.m_type == POWERUP_EMP && countDown == 0) {
			game.SpawnExplosion (time, EXPLOSION_EMP, tempAnchor.m_x, tempAnchor.m_y );
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
				tempAnchor.m_type = previousAnchor.m_type;
				tempAnchor.m_x = previousAnchor.m_x;
				tempAnchor.m_y = previousAnchor.m_y;
				tempAnchor.m_countDown = previousAnchor.m_countDown;
				tempAnchor.m_live = previousAnchor.m_live;
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
		var nextAnchor = null;
		
		for (var i=0; i<this.m_data.length-1; i++) {
			if (time >= this.m_data[i].m_time && time < this.m_data[i+1].m_time) {
				prevAnchor = this.m_data[i];
				nextAnchor = this.m_data[i+1];
				break;
			}
		}
		
		if (prevAnchor) {
			this.m_x = prevAnchor.m_x;
			this.m_y = prevAnchor.m_y;
			this.m_type = prevAnchor.m_type;
			
			var interpolateFactor = (time - prevAnchor.m_time) / (nextAnchor.m_time - prevAnchor.m_time);
			this.m_countDown = prevAnchor.m_countDown + (nextAnchor.m_countDown - prevAnchor.m_countDown) * interpolateFactor;
			
			
			if (this.m_live == false && prevAnchor.m_live == true) {
				g_soundEngine.PlaySound (sndPlane);
			}
			this.m_live = prevAnchor.m_live;
		}
		else {
			this.m_live = false;
		}
	}
	
	// Draw - obvious comment is obvious
	this.Draw = function () {
		if (this.m_live) {
			if (this.m_countDown > 0 && this.m_type == POWERUP_AIRSTRIKE) {
				g_graphicEngine.DrawFast (g_context, imgAirPlane[this.m_team], this.m_x * BLOCK_SIZE + AIRPLANE_OFFSET + g_gsActionPhase.m_screenShakeX, -AIRPLANE_SPRITE_SIZE + this.m_countDown * (CANVAS_H + AIRPLANE_SPRITE_SIZE) / AIRSTRIKE_COUNTDOWN + g_gsActionPhase.m_screenShakeY);
			}
			else if (this.m_countDown > 0 && this.m_type == POWERUP_EMP) {
				g_graphicEngine.DrawFast (g_context, imgAirPlane[this.m_team], this.m_x * BLOCK_SIZE + AIRPLANE_OFFSET + g_gsActionPhase.m_screenShakeX, -AIRPLANE_SPRITE_SIZE + this.m_countDown * (CANVAS_H + AIRPLANE_SPRITE_SIZE) / AIRSTRIKE_COUNTDOWN + g_gsActionPhase.m_screenShakeY);
			}
			
			whiteSmoke[0].Resume();
			whiteSmoke[0].m_x = this.m_x * BLOCK_SIZE + AIRPLANE_OFFSET + AIRPLANE_SMOKE_OFFSET_X_1;
			whiteSmoke[0].m_y = -AIRPLANE_SPRITE_SIZE + this.m_countDown * (CANVAS_H + AIRPLANE_SPRITE_SIZE) / AIRSTRIKE_COUNTDOWN + AIRPLANE_SMOKE_OFFSET_Y_1;
			
			whiteSmoke[1].Resume();
			whiteSmoke[1].m_x = this.m_x * BLOCK_SIZE + AIRPLANE_OFFSET + AIRPLANE_SMOKE_OFFSET_X_2;
			whiteSmoke[1].m_y = -AIRPLANE_SPRITE_SIZE + this.m_countDown * (CANVAS_H + AIRPLANE_SPRITE_SIZE) / AIRSTRIKE_COUNTDOWN + AIRPLANE_SMOKE_OFFSET_Y_2;
		}
		else {
			whiteSmoke[0].Pause();
			whiteSmoke[1].Pause();
		}
	}
}