function Obstacle (game, id) {
	var OBSTACLE_HP = 100;
	
	// Identifier
	this.m_id = id;

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
	var imgBrick = [];
	imgBrick[0] = g_graphicEngine.LoadImage("Image/Map/Brick 1.png");
	imgBrick[1] = g_graphicEngine.LoadImage("Image/Map/Brick 2.png");
	imgBrick[2] = g_graphicEngine.LoadImage("Image/Map/Brick 3.png");
	imgBrick[3] = g_graphicEngine.LoadImage("Image/Map/Brick 4.png");
	imgBrick[4] = g_graphicEngine.LoadImage("Image/Map/Brick 5.png");
	
	// Add a state in a specific time
	this.AddDataAnchor = function (time, x, y, HP) {
		var tempAnchor = new DataAnchor();
		tempAnchor.m_time = time;
		tempAnchor.m_x = x;
		tempAnchor.m_y = y;
		tempAnchor.m_HP = HP;
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
	
	// Draw - obvious comment is obvious
	this.Draw = function () {
		if (shouldDraw) {
			if(this.m_HP > OBSTACLE_HP * 0.75)
				g_graphicEngine.DrawFast (g_context, imgBrick[0], this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY);
			else if(this.m_HP > OBSTACLE_HP * 0.5)
				g_graphicEngine.DrawFast (g_context, imgBrick[1], this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY);
			else if(this.m_HP > OBSTACLE_HP * 0.25)
				g_graphicEngine.DrawFast (g_context, imgBrick[2], this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY);
			else if(this.m_HP > 0)
				g_graphicEngine.DrawFast (g_context, imgBrick[3], this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY);
			else
				g_graphicEngine.DrawFast (g_context, imgBrick[4], this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY);
		}
	}
}