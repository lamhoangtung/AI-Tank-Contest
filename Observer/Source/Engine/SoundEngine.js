function SoundEngine() {
	// Allocate memory for the sound cache
	var soundBuffer		= new Array();
	var soundName    	= new Array();
	var soundDelay		= new Array();
	var soundCooldown	= new Array();
	
	var soundPlayingIndex = new Array();
	
	var completedNumber = 0;
	var totalNumber = 0;
	
	// Load a sound
	this.LoadSound = function (path, number, delay) {
		// Check if the sound is loaded.
		for (var i=0; i<soundName.length; i++) {
			if (soundName[i] == path) {
				return i;
			}
		}
		
		// Sound not loaded. Load it.
		totalNumber ++;
		var newID = soundName.length;
		
		soundName[newID] = path;
		soundDelay[newID] = delay;
		soundCooldown[newID] = 0;
		soundPlayingIndex[newID] = 0;
		
		soundBuffer[newID] = new Array();
		for (var i=0; i<number; i++) {
			soundBuffer[newID][i] = new Audio();
			soundBuffer[newID][i].src = path;
			soundBuffer[newID][i].load();
			soundBuffer[newID][i].oncanplaythrough = function() {
				completedNumber ++;
			}
		}
		
		return newID;
	};
	
	// Get the loading progress, return in percent.
	this.GetProgress = function () {
		if (totalNumber > 0) {
			if (completedNumber < totalNumber) {
				return completedNumber * 100 / totalNumber;
			}
			else {
				return 100;
			}
		}
		else {
			return 100;
		}
	};
	
	
	// This method needs to be called on every game loop.
	// It's for anti-resonance purpose.
	this.Update = function (deltaTime) {
		for (var i=0; i<soundCooldown.length; i++) {
			if (soundCooldown[i] > 0) {
				soundCooldown[i] -= deltaTime;
			}
		}
	};
	
	// Play a sound
	this.PlaySound = function (id)	{
		if (soundCooldown[id] <= 0) {
			var soundTurn = soundPlayingIndex[id];
			
			soundPlayingIndex[id] ++;
			if (soundPlayingIndex[id] >= soundBuffer[id].length) {
				soundPlayingIndex[id] = 0;
			}
			
			var tempSound = soundBuffer[id][soundTurn];
			if (tempSound != null) {
				tempSound.currentTime = 0;
				tempSound.play();
			}
			
			soundCooldown[id] = soundDelay[id];
		}
	};
}

