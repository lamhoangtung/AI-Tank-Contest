function StateEngine () {
	var DELTA_TIME_THRESHOLD = 200;
	var FADE_SPEED = 0.003;
	
	var instance = this;
	
	
	this.m_context = null;
	
	var stateStack = new Array();
	var newState = null;
	var switching = false;
	var switchStep = 0;
	var switchAlpha = 0;
	
	this.Update = function (deltaTime) {
		if (deltaTime < DELTA_TIME_THRESHOLD) {
			if (switching == false) {
				if (stateStack.length > 0) {
					stateStack[stateStack.length-1].Update(deltaTime);
				}
			}
				
			for (var i=0; i<stateStack.length; i++) {
				stateStack[i].Draw();
			}
			
			if (switching == true) {
				if (switchStep == 0) {
					switchAlpha += deltaTime * FADE_SPEED;
					if (switchAlpha > 1) {
						switchAlpha = 1;
						switchStep = 1;
						
						stateStack.pop ();
						stateStack.push (newState);
					}
					g_graphicEngine.FillCanvas (g_context, 255, 255, 255, switchAlpha);
				}
				else if (switchStep == 1) {
					switchAlpha -= deltaTime * FADE_SPEED;
					if (switchAlpha < 0) {
						switchAlpha = 0;
						switchStep = 0;
						switching = false;
					}
					g_graphicEngine.FillCanvas (g_context, 255, 255, 255, switchAlpha);
				}
			}
		}
	}
	
	this.SwitchState = function (state, fade) {
		if (stateStack.length == 0) {
			stateStack.push (state);
		}
		else {
			if (fade == null) fade = 0;
			if (fade == 0) {
				switchStep = 0;
				switchAlpha = 0;
			}
			else if (fade == 1) {
				newState = state;
				switchStep = 0;
				switchAlpha = 0;
				switching = true;
			}
		}
	}
	
	this.PushState = function (state) {
		stateStack.push (state);
	}
	
	this.PopState = function () {
		stateStack.pop ();
	}

	this.Start = function() {
		Update ();
	}
	
	this.SetContext = function (context) {
		this.m_context = context;
	}
	
	
	var lastTime = new Date();
	var Update = function () {
		var curTime = new Date();
		instance.Update (curTime - lastTime);
		lastTime = curTime;
		
		requestAnimFrame (Update);
	}
}




// Register the main loop here
window.requestAnimFrame = (function () {
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function (callback) {
				window.setTimeout(callback, 16);
			};
	}
)();