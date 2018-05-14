function Tank (game, id, team, type) {
	var TANK_SHADOW_OFFSET = 3;
	var HP_BAR_OFFSET = -5;
	
	var TANK_MAX_HP = new Array();
	TANK_MAX_HP [TANK_LIGHT] = 80;
	TANK_MAX_HP [TANK_MEDIUM] = 110;
	TANK_MAX_HP [TANK_HEAVY] = 170;
	
	var CANNON_MUZZLE_OFFSET = 1.2;
	var GUN_MUZZLE_OFFSET = 0.5;
	

	// Identifier
	this.m_id = id;
	this.m_team = team;
	this.m_type = type;
	
	// An array to contain state in the past
	function DataAnchor() {
		this.m_time = 0;
		this.m_x = 0;
		this.m_y = 0;
		this.m_direction = 0;
		this.m_HP = 0;
		this.m_coolDown = 0;
		this.m_disabled = 0;
	}
	this.m_data = new Array();
	
	// Current state
	this.m_x = -1;
	this.m_y = -1;
	this.m_direction = 0;
	this.m_HP = 1;
	this.m_coolDown = 0;
	this.m_disabled = 0;
	
	// Local variable
	// Indicate if the object is updated by a packet
	var dirty = false;
	var shouldDraw = true;
	
	// Image
	var imgTank = new Array();
	imgTank[TEAM_1] = new Array();
	
	imgTank[TEAM_1][TANK_LIGHT] = new Array();
	imgTank[TEAM_1][TANK_LIGHT][0] = g_graphicEngine.LoadImage("Image/Tank/Team 1/1A.png");
	imgTank[TEAM_1][TANK_LIGHT][1] = g_graphicEngine.LoadImage("Image/Tank/Team 1/1B.png");
	imgTank[TEAM_1][TANK_LIGHT][2] = g_graphicEngine.LoadImage("Image/Tank/Team 1/1C.png");
	imgTank[TEAM_1][TANK_LIGHT][3] = g_graphicEngine.LoadImage("Image/Tank/Team 1/1D.png");
	
	imgTank[TEAM_1][TANK_MEDIUM] = new Array();
	imgTank[TEAM_1][TANK_MEDIUM][0] = g_graphicEngine.LoadImage("Image/Tank/Team 1/2A.png");
	imgTank[TEAM_1][TANK_MEDIUM][1] = g_graphicEngine.LoadImage("Image/Tank/Team 1/2B.png");
	imgTank[TEAM_1][TANK_MEDIUM][2] = g_graphicEngine.LoadImage("Image/Tank/Team 1/2C.png");
	imgTank[TEAM_1][TANK_MEDIUM][3] = g_graphicEngine.LoadImage("Image/Tank/Team 1/2D.png");
	
	imgTank[TEAM_1][TANK_HEAVY] = new Array();
	imgTank[TEAM_1][TANK_HEAVY][0] = g_graphicEngine.LoadImage("Image/Tank/Team 1/3A.png");
	imgTank[TEAM_1][TANK_HEAVY][1] = g_graphicEngine.LoadImage("Image/Tank/Team 1/3B.png");
	imgTank[TEAM_1][TANK_HEAVY][2] = g_graphicEngine.LoadImage("Image/Tank/Team 1/3C.png");
	imgTank[TEAM_1][TANK_HEAVY][3] = g_graphicEngine.LoadImage("Image/Tank/Team 1/3D.png");
	
	
	imgTank[TEAM_2] = new Array();
	
	imgTank[TEAM_2][TANK_LIGHT] = new Array();
	imgTank[TEAM_2][TANK_LIGHT][0] = g_graphicEngine.LoadImage("Image/Tank/Team 2/1A.png");
	imgTank[TEAM_2][TANK_LIGHT][1] = g_graphicEngine.LoadImage("Image/Tank/Team 2/1B.png");
	imgTank[TEAM_2][TANK_LIGHT][2] = g_graphicEngine.LoadImage("Image/Tank/Team 2/1C.png");
	imgTank[TEAM_2][TANK_LIGHT][3] = g_graphicEngine.LoadImage("Image/Tank/Team 2/1D.png");
	
	imgTank[TEAM_2][TANK_MEDIUM] = new Array();
	imgTank[TEAM_2][TANK_MEDIUM][0] = g_graphicEngine.LoadImage("Image/Tank/Team 2/2A.png");
	imgTank[TEAM_2][TANK_MEDIUM][1] = g_graphicEngine.LoadImage("Image/Tank/Team 2/2B.png");
	imgTank[TEAM_2][TANK_MEDIUM][2] = g_graphicEngine.LoadImage("Image/Tank/Team 2/2C.png");
	imgTank[TEAM_2][TANK_MEDIUM][3] = g_graphicEngine.LoadImage("Image/Tank/Team 2/2D.png");
	
	imgTank[TEAM_2][TANK_HEAVY] = new Array();
	imgTank[TEAM_2][TANK_HEAVY][0] = g_graphicEngine.LoadImage("Image/Tank/Team 2/3A.png");
	imgTank[TEAM_2][TANK_HEAVY][1] = g_graphicEngine.LoadImage("Image/Tank/Team 2/3B.png");
	imgTank[TEAM_2][TANK_HEAVY][2] = g_graphicEngine.LoadImage("Image/Tank/Team 2/3C.png");
	imgTank[TEAM_2][TANK_HEAVY][3] = g_graphicEngine.LoadImage("Image/Tank/Team 2/3D.png");
	
	
	var imgTankS = new Array();
	imgTankS[TEAM_1] = new Array();
	imgTankS[TEAM_2] = new Array();
	imgTankS[TEAM_1][TANK_LIGHT] = g_graphicEngine.LoadImage("Image/Tank/Team 1/1S.png");
	imgTankS[TEAM_1][TANK_MEDIUM] = g_graphicEngine.LoadImage("Image/Tank/Team 1/2S.png");
	imgTankS[TEAM_1][TANK_HEAVY] = g_graphicEngine.LoadImage("Image/Tank/Team 1/3S.png");
	imgTankS[TEAM_2][TANK_LIGHT] = g_graphicEngine.LoadImage("Image/Tank/Team 2/1S.png");
	imgTankS[TEAM_2][TANK_MEDIUM] = g_graphicEngine.LoadImage("Image/Tank/Team 2/2S.png");
	imgTankS[TEAM_2][TANK_HEAVY] = g_graphicEngine.LoadImage("Image/Tank/Team 2/3S.png");
	
	// Particle
	var blackSmoke = g_particleDef.CreateTankSmokeEmitter();
	blackSmoke.m_x = 0;
	blackSmoke.m_y = 0;
	
	
	
	// Add a state in a specific time
	this.AddDataAnchor = function (time, x, y, dir, HP, CD, disabled) {
		var tempAnchor = new DataAnchor();
		tempAnchor.m_time = time;
		tempAnchor.m_x = x;
		tempAnchor.m_y = y;
		tempAnchor.m_direction = dir;
		tempAnchor.m_HP = HP;
		tempAnchor.m_coolDown = CD;
		tempAnchor.m_disabled = disabled;
		
		// Check previous data node.
		if (this.m_data.length > 0) {
			var previousAnchor = this.m_data[this.m_data.length-1];
			
			// Suddenly, the tank HP go to 0. It must have been killed.
			// We'll create a small explosion here.
			if (previousAnchor.m_HP > 0 && tempAnchor.m_HP == 0) {
				game.SpawnExplosion (time, EXPLOSION_TANK, tempAnchor.m_x, tempAnchor.m_y);
			}
			
			// If the cooldown suddenly increase, it must have just shot something.
			if (previousAnchor.m_coolDown < tempAnchor.m_coolDown) {
				if (this.m_type != TANK_HEAVY) {
					if (tempAnchor.m_direction == DIRECTION_UP) {
						game.SpawnExplosion (time, EXPLOSION_CANNON_MUZZLE, tempAnchor.m_x, tempAnchor.m_y - CANNON_MUZZLE_OFFSET, 0);
					}
					else if (tempAnchor.m_direction == DIRECTION_DOWN) {
						game.SpawnExplosion (time, EXPLOSION_CANNON_MUZZLE, tempAnchor.m_x, tempAnchor.m_y + CANNON_MUZZLE_OFFSET, 180);
					}
					else if (tempAnchor.m_direction == DIRECTION_LEFT) {
						game.SpawnExplosion (time, EXPLOSION_CANNON_MUZZLE, tempAnchor.m_x - CANNON_MUZZLE_OFFSET, tempAnchor.m_y, 270);
					}
					else if (tempAnchor.m_direction == DIRECTION_RIGHT) {
						game.SpawnExplosion (time, EXPLOSION_CANNON_MUZZLE, tempAnchor.m_x + CANNON_MUZZLE_OFFSET, tempAnchor.m_y, 90);
					}
				}
				else {
					if (tempAnchor.m_direction == DIRECTION_UP) {
						game.SpawnExplosion (time, EXPLOSION_GUN_MUZZLE, tempAnchor.m_x, tempAnchor.m_y - GUN_MUZZLE_OFFSET, 0);
						game.SpawnExplosion (time + 1, EXPLOSION_GUN_MUZZLE, tempAnchor.m_x, tempAnchor.m_y - GUN_MUZZLE_OFFSET, 0, true, false);
					}
					else if (tempAnchor.m_direction == DIRECTION_DOWN) {
						game.SpawnExplosion (time, EXPLOSION_GUN_MUZZLE, tempAnchor.m_x, tempAnchor.m_y + GUN_MUZZLE_OFFSET, 180);
						game.SpawnExplosion (time + 1, EXPLOSION_GUN_MUZZLE, tempAnchor.m_x, tempAnchor.m_y + GUN_MUZZLE_OFFSET, 180, true, false);
					}
					else if (tempAnchor.m_direction == DIRECTION_LEFT) {
						game.SpawnExplosion (time, EXPLOSION_GUN_MUZZLE, tempAnchor.m_x - GUN_MUZZLE_OFFSET, tempAnchor.m_y, 270);
						game.SpawnExplosion (time + 1, EXPLOSION_GUN_MUZZLE, tempAnchor.m_x - GUN_MUZZLE_OFFSET, tempAnchor.m_y, 270, true, false);
					}
					else if (tempAnchor.m_direction == DIRECTION_RIGHT) {
						game.SpawnExplosion (time, EXPLOSION_GUN_MUZZLE, tempAnchor.m_x + GUN_MUZZLE_OFFSET, tempAnchor.m_y, 90);
						game.SpawnExplosion (time + 1, EXPLOSION_GUN_MUZZLE, tempAnchor.m_x + GUN_MUZZLE_OFFSET, tempAnchor.m_y, 90, true, false);
					}
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
				tempAnchor.m_direction = previousAnchor.m_direction;
				tempAnchor.m_HP = previousAnchor.m_HP;
				tempAnchor.m_coolDown = previousAnchor.m_coolDown;
				tempAnchor.m_disabled = previousAnchor.m_disabled;
				this.m_data.push (tempAnchor);
			}
		}
		else {
			dirty = false;
		}
	}

	this.Hit = function () {
		
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
		
		if (prevAnchor && nextAnchor) {
			var interpolateFactor = (time - prevAnchor.m_time) / (nextAnchor.m_time - prevAnchor.m_time);
			this.m_x = prevAnchor.m_x + (nextAnchor.m_x - prevAnchor.m_x) * interpolateFactor;
			this.m_y = prevAnchor.m_y + (nextAnchor.m_y - prevAnchor.m_y) * interpolateFactor;
			this.m_disabled = prevAnchor.m_disabled + (nextAnchor.m_disabled - prevAnchor.m_disabled) * interpolateFactor;
			this.m_direction = prevAnchor.m_direction;
			this.m_HP = prevAnchor.m_HP;
			this.m_coolDown = prevAnchor.m_coolDown;
			
			shouldDraw = true;
		}
		else {
			shouldDraw = false;
		}
	}
	
	
	// Draw - obvious comment is obvious
	this.Draw = function () {
		if (shouldDraw) {
			var angle = 0;
			if (this.m_direction == DIRECTION_UP) {
				angle = 0;
			}
			else if (this.m_direction == DIRECTION_RIGHT) {
				angle = 90;
			}
			else if (this.m_direction == DIRECTION_DOWN) {
				angle = 180;
			}
			else if (this.m_direction == DIRECTION_LEFT) {
				angle = 270;
			}
			
			g_graphicEngine.Draw (g_context, imgTankS[this.m_team][this.m_type], 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x * BLOCK_SIZE + TANK_SHADOW_OFFSET + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + TANK_SHADOW_OFFSET + g_gsActionPhase.m_screenShakeY, BLOCK_SIZE, BLOCK_SIZE, 1, false, false, angle);
			
			if (this.m_HP > TANK_MAX_HP[this.m_type] * 0.67) {
				blackSmoke.Pause();
				g_graphicEngine.Draw (g_context, imgTank[this.m_team][this.m_type][0], 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY, BLOCK_SIZE, BLOCK_SIZE, 1, false, false, angle);
			}
			else if (this.m_HP > TANK_MAX_HP[this.m_type] * 0.33) {
				blackSmoke.Resume();
				blackSmoke.m_emitRate = 0.005;
				g_graphicEngine.Draw (g_context, imgTank[this.m_team][this.m_type][1], 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY, BLOCK_SIZE, BLOCK_SIZE, 1, false, false, angle);
			}
			else if (this.m_HP > 0) {
				blackSmoke.Resume();
				blackSmoke.m_emitRate = 0.02;
				g_graphicEngine.Draw (g_context, imgTank[this.m_team][this.m_type][2], 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY, BLOCK_SIZE, BLOCK_SIZE, 1, false, false, angle);
			}
			else {
				blackSmoke.Resume();
				blackSmoke.m_emitRate = 0.04;
				g_graphicEngine.Draw (g_context, imgTank[this.m_team][this.m_type][3], 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY, BLOCK_SIZE, BLOCK_SIZE, 1, false, false, angle);
			}
			blackSmoke.m_x = (this.m_x + 0.5) * BLOCK_SIZE;
			blackSmoke.m_y = (this.m_y + 0.5) * BLOCK_SIZE;
			
			if (this.m_HP > 0) {
				g_graphicEngine.FillCanvas (g_context, 192, 0, 0, 1, this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY + HP_BAR_OFFSET, BLOCK_SIZE, 4);
				g_graphicEngine.FillCanvas (g_context, 0, 192, 0, 1, this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY + HP_BAR_OFFSET, BLOCK_SIZE * (this.m_HP / TANK_MAX_HP[this.m_type]), 4);
			}
		}
	}
}