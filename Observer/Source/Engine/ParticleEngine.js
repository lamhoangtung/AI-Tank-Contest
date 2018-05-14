function SourceRect (id, x, y, w, h) {
	this.m_id = id;
	this.m_x = x;
	this.m_y = y;
	this.m_w = w;
	this.m_h = h;
}

function Particle(context) {
	this.m_context = context;
	
	this.Reset = function () {
		// Life
		this.m_start = false;
		this.m_lifeTime = 0;
		this.m_time = 0;
		
		// Moving
		this.m_x = 0;
		this.m_y = 0;
		this.m_moveSpeedX = 0;
		this.m_moveSpeedY = 0;
		this.m_resistant = 0;
		this.m_gravity = 0;
		
		// Rotating
		this.m_angle = 0;
		this.m_rotateSpeed = 0;
		this.m_rotateResistant = 0;
		this.m_rotateAcceleration = 0;
		
		// Fade
		this.m_alpha = 1;
		this.m_fadeSpeed = 0;
		
		// Image
		this.m_sourceRectArray = [];
		this.m_frameLength = 0;
		this.m_w = 0;
		this.m_h = 0;
		this.m_scaleSpeed = 0;
		this.m_drawAdd = false;
	}
	
	this.Reset();
	
	var frameCount = 0;
	var currentFrame = 0;
	this.Start = function () {
		this.m_start = true;
		this.m_time = 0;
		currentFrame = 0;
	}
	
	this.Update = function (deltaTime) {
		if (this.m_start) {
			// Update life time
			this.m_time += deltaTime;
			if (this.m_time >= this.m_lifeTime) {
				this.m_start = false;
			}
			
			// Update animation
			frameCount += deltaTime;
			if (frameCount >= this.m_frameLength) {
				frameCount -= this.m_frameLength;
				currentFrame ++;
				if (currentFrame >= this.m_sourceRectArray.length) {
					currentFrame = 0;
				}
			}
			
			// Air resistant
			var resistant = this.m_resistant * deltaTime;
			
			if (this.m_moveSpeedX > 0) {
				this.m_moveSpeedX -= resistant;
				if (this.m_moveSpeedX < 0) this.m_moveSpeedX = 0;
			}
			else if (this.m_moveSpeedX < 0) {
				this.m_moveSpeedX += resistant;
				if (this.m_moveSpeedX > 0) this.m_moveSpeedX = 0;
			}
			
			if (this.m_moveSpeedY > 0) {
				this.m_moveSpeedY -= resistant;
				if (this.m_moveSpeedY < 0) this.m_moveSpeedY = 0;
			}
			else if (this.m_moveSpeedY < 0) {
				this.m_moveSpeedY += resistant;
				if (this.m_moveSpeedY > 0) this.m_moveSpeedY = 0;
			}
			
			// Gravity
			this.m_moveSpeedY += this.m_gravity * deltaTime;
			
			// Move
			this.m_x += this.m_moveSpeedX * deltaTime;
			this.m_y += this.m_moveSpeedY * deltaTime;
			
			
			// Rotate air resistant
			resistant = this.m_rotateResistant * deltaTime;
			if (this.m_rotateSpeed > resistant) {
				this.m_rotateSpeed -= resistant;
			}
			else if (this.m_rotateSpeed < -resistant) {
				this.m_rotateSpeed += resistant;
			}
			else {
				this.m_rotateSpeed = 0;
			}
			
			// Rotate acceleration
			if (this.m_rotateAcceleration != 0) {
				this.m_rotateSpeed += this.m_rotateAcceleration * deltaTime;
			}
			
			this.m_angle += this.m_rotateSpeed * deltaTime;
			if (this.m_angle > 360) this.m_angle -= 360;
			if (this.m_angle < 360) this.m_angle += 360;
			
			// Scale speed
			this.m_w += this.m_scaleSpeed * deltaTime * this.m_w;
			this.m_h += this.m_scaleSpeed * deltaTime * this.m_h;
			
			// Fade
			this.m_alpha += this.m_fadeSpeed * deltaTime;
		}
	}
	
	
	this.Draw = function (context, x, y, w, h) {
		if (this.m_start) {
			if (context == null) context = this.m_context;
			
			var offsetX = 0;
			var offsetY = 0;
			if (x != null) {
				if (this.m_x >= x && this.m_y >= y && this.m_x + this.m_w <= x + w && this.m_y + this.m_h <= y + h) {
				
				}
				else {
					return;
				}
				
				if (navigator.isCocoonJS) {
					offsetX = x;
					offsetY = y;
				}
			}
			
			var sourceRect = this.m_sourceRectArray[currentFrame];
			if (this.m_drawAdd) this.m_graphicEngine.SetDrawModeAddActive (context, true);
			this.m_graphicEngine.Draw (context, sourceRect.m_id, sourceRect.m_x, sourceRect.m_y, sourceRect.m_w, sourceRect.m_h, this.m_x - offsetX - (this.m_w * 0.5) >> 0, this.m_y - offsetY - (this.m_h * 0.5) >> 0, this.m_w, this.m_h, this.m_alpha, 0, 0, this.m_angle);
			if (this.m_drawAdd) this.m_graphicEngine.SetDrawModeAddActive (context, false);
		}
	}
	
	
	this.CloneFrom = function (rhs) {
		this.m_context = rhs.m_context;
		
		// Life
		this.m_start = rhs.m_start;
		this.m_lifeTime = rhs.m_lifeTime;
		this.m_time = rhs.m_time;
		
		// Moving
		this.m_x = rhs.m_x;
		this.m_y = rhs.m_y;
		this.m_moveSpeedX = rhs.m_moveSpeedX;
		this.m_moveSpeedY = rhs.m_moveSpeedY;
		this.m_resistant = rhs.m_resistant;
		this.m_gravity = rhs.m_gravity;
		
		// Rotating
		this.m_angle = rhs.m_angle;
		this.m_rotateSpeed = rhs.m_rotateSpeed;
		this.m_rotateResistant = rhs.m_rotateResistant;
		this.m_rotateAcceleration = rhs.m_rotateAcceleration;
		
		// Fade
		this.m_alpha = rhs.m_alpha;
		this.m_fadeSpeed = rhs.m_fadeSpeed;
		
		// Image
		this.m_sourceRectArray = rhs.m_sourceRectArray;
		this.m_frameLength = rhs.m_frameLength;
		this.m_w = rhs.m_w;
		this.m_h = rhs.m_h;
		this.m_scaleSpeed = rhs.m_scaleSpeed;
		this.m_drawAdd = rhs.m_drawAdd;
	}
}


function Emitter (particle) {
	// Instance
	var instance = this;
	var degToRad = 0.0174532925199433;
	
	// Clear all variable - reset
	this.Reset = function () {
		// Position
		this.m_x = 0;
		this.m_y = 0;
		this.m_w = 0;
		this.m_h = 0;
		
		// Life
		this.m_lifeTime = 0;
		this.m_time = 0;
		this.m_start = false;
		
		// Emit parameters
		this.m_emitForceMin = 0;
		this.m_emitForceMax = 0;
		this.m_emitAngleStart = 0;
		this.m_emitAngleEnd = 360;
		this.m_emitRate = 0;
		
		// Particle parameters
		this.m_randomizeScaleMin = 0;
		this.m_randomizeScaleMax = 0;
		this.m_randomizeAngleMin = 0;
		this.m_randomizeAngleMax = 0;
		this.m_randomizeLifeMin  = 0;
		this.m_randomizeLifeMax  = 0;
		this.m_randomizeRotateSpeedMin = 0;
		this.m_randomizeRotateSpeedMax = 0;
		
		this.m_sampleParticle = [];
		this.m_engine = null;
	}
	
	this.Reset();
	
	
	var emitCount = 0;
	
	this.SetSampleParticle = function (particle) {
		var index = this.m_sampleParticle.length;
		this.m_sampleParticle[index] = particle;
		
	}
	
	this.Start = function () {
		this.m_start = true;
		this.m_time = 0;
		this.m_emitTime = 0;
	}
	
	this.Pause = function() {
		this.m_start = false;
	}
	this.Resume = function() {
		this.m_start = true;
	}
	
	
	this.Update = function (deltaTime) {
		if (this.m_start) {
			// Life
			this.m_time += deltaTime;
			if (this.m_lifeTime > 0) {
				if (this.m_time >= this.m_lifeTime) {
					this.m_start = false;
					return;
				}
			}
			
			var emitNumber = 0;
			emitCount += deltaTime;
			emitNumber = (emitCount * this.m_emitRate) >> 0;
			if (emitNumber > 0) {
				emitCount -= emitNumber / this.m_emitRate;
			}
			
			for (var i=0; i<emitNumber; i++) {
				var tempParticle = this.m_engine.CreateParticle();
				
				if (tempParticle != null) {
					var sample = (Math.random() * this.m_sampleParticle.length) >> 0;
					tempParticle.CloneFrom (this.m_sampleParticle[sample]);
					tempParticle.Start ();
					
					// Force and direction
					var randomAngle = Math.random() * (this.m_emitAngleEnd - this.m_emitAngleStart) + this.m_emitAngleStart;
						randomAngle = randomAngle % 360;
						randomAngle *= degToRad;
					var randomForce = Math.random() * (this.m_emitForceMax - this.m_emitForceMin) + this.m_emitForceMin;
					tempParticle.m_moveSpeedX = Math.sin(randomAngle) * randomForce;
					tempParticle.m_moveSpeedY = - Math.cos(randomAngle) * randomForce;
					
					// Position
					if (this.m_w == 0 && this.m_h == 0) {
						tempParticle.m_x = this.m_x;
						tempParticle.m_y = this.m_y;
					}
					else {
						var randomX = this.m_x + Math.random() * this.m_w;
						var randomY = this.m_y + Math.random() * this.m_h;
						tempParticle.m_x = randomX;
						tempParticle.m_y = randomY;
					}
					
					// Life
					if (this.m_randomizeLifeMax == 0 && this.m_randomizeLifeMin == 0) {}
					else {
						var randomLife = Math.random() * (this.m_randomizeLifeMax - this.m_randomizeLifeMin) + this.m_randomizeLifeMin;
						tempParticle.m_lifeTime =  randomLife;
					}
					
					// Angle
					if (this.m_randomizeAngleMax == 0 && this.m_randomizeAngleMin == 0) {}
					else {
						var randomAngle  = Math.random() * (this.m_randomizeAngleMax - this.m_randomizeAngleMin) + this.m_randomizeAngleMin;
						tempParticle.m_angle = randomAngle;
					}
					
					// Rotate speed
					if (this.m_randomizeRotateSpeedMin == 0 && this.m_randomizeRotateSpeedMax == 0) {}
					else {
						var randomSpeed  = Math.random() * (this.m_randomizeRotateSpeedMax - this.m_randomizeRotateSpeedMin) + this.m_randomizeRotateSpeedMin;
						tempParticle.m_rotateSpeed = randomSpeed;
					}
					
					// Scale
					if (this.m_randomizeScaleMin == 0 && this.m_randomizeScaleMax == 0) {}
					else {
						var randomScale  = Math.random() * (this.m_randomizeScaleMax - this.m_randomizeScaleMin) + this.m_randomizeScaleMin;
						tempParticle.m_w *= randomScale;
						tempParticle.m_h *= randomScale;
					}
					
					tempParticle.Start();
				}
			}
		}
	}
	
	this.ManualEmit = function (emitNumber) {
		for (var i=0; i<emitNumber; i++) {
			var tempParticle = this.m_engine.CreateParticle();
			
			if (tempParticle != null) {
				var sample = (Math.random() * this.m_sampleParticle.length) >> 0;
				tempParticle.CloneFrom (this.m_sampleParticle[sample]);
				tempParticle.Start ();
				
				// Force and direction
				var randomAngle = Math.random() * (this.m_emitAngleEnd - this.m_emitAngleStart) + this.m_emitAngleStart;
					randomAngle = randomAngle % 360;
					randomAngle *= degToRad;
				var randomForce = Math.random() * (this.m_emitForceMax - this.m_emitForceMin) + this.m_emitForceMin;
				tempParticle.m_moveSpeedX = Math.sin(randomAngle) * randomForce;
				tempParticle.m_moveSpeedY = - Math.cos(randomAngle) * randomForce;
				
				// Position
				if (this.m_w == 0 && this.m_h == 0) {
					tempParticle.m_x = this.m_x;
					tempParticle.m_y = this.m_y;
				}
				else {
					var randomX = this.m_x + Math.random() * this.m_w;
					var randomY = this.m_y + Math.random() * this.m_h;
					tempParticle.m_x = randomX;
					tempParticle.m_y = randomY;
				}
				
				// Life
				if (this.m_randomizeLifeMax == 0 && this.m_randomizeLifeMin == 0) {}
				else {
					var randomLife = Math.random() * (this.m_randomizeLifeMax - this.m_randomizeLifeMin) + this.m_randomizeLifeMin;
					tempParticle.m_lifeTime =  randomLife;
				}
				
				// Angle
				if (this.m_randomizeAngleMax == 0 && this.m_randomizeAngleMin == 0) {}
				else {
					var randomAngle  = Math.random() * (this.m_randomizeAngleMax - this.m_randomizeAngleMin) + this.m_randomizeAngleMin;
					tempParticle.m_angle = randomAngle;
				}
				
				// Rotate speed
				if (this.m_randomizeRotateSpeedMin == 0 && this.m_randomizeRotateSpeedMax == 0) {}
				else {
					var randomSpeed  = Math.random() * (this.m_randomizeRotateSpeedMax - this.m_randomizeRotateSpeedMin) + this.m_randomizeRotateSpeedMin;
					tempParticle.m_rotateSpeed = randomSpeed;
				}
				
				// Scale
				if (this.m_randomizeScaleMin == 0 && this.m_randomizeScaleMax == 0) {}
				else {
					var randomScale  = Math.random() * (this.m_randomizeScaleMax - this.m_randomizeScaleMin) + this.m_randomizeScaleMin;
					tempParticle.m_w *= randomScale;
					tempParticle.m_h *= randomScale;
				}
				
				tempParticle.Start();
			}
		}
	}
}


function ParticleEngine () {
	var NUMBER_OF_EMITTER = 200;
	var NUMBER_OF_PARTICLE = 20000;
	var particlePool = new Array();
	var emitterPool = new Array();
	
	
	this.m_context = null;
	this.m_graphicEngine = null;
	
	this.SetContext = function (context, engine) {
		this.m_context = context;
		this.m_graphicEngine = engine;
	}
	
	this.CreateEmitter = function () {
		var tempEmitter = new Emitter();
		tempEmitter.m_engine = this;
		
		emitterPool.push (tempEmitter);
		return tempEmitter;
	}
	
	this.RemoveEmitter = function (e) {
		for (var i=0; i<emitterPool.length; i++) {
			if (e == emitterPool[i]) {
				emitterPool.splice (i, 1);
			}
		}
	}
	
	this.CreateParticle = function () {
		var tempParticle = null;
		
		for (var j=0; j<particlePool.length; j++) {
			if (particlePool[j]) {
				if (!particlePool[j].m_start) {
					tempParticle = particlePool[j];
					break;
				}
			}
		}
		
		if (tempParticle == null) {
			if (particlePool.length == NUMBER_OF_PARTICLE) {
				return;
			}
			tempParticle = new Particle(this.m_context);
			tempParticle.m_graphicEngine = this.m_graphicEngine;
			// CocoonJS hack
			//tempParticle.m_graphicEngine = g_graphicEngine;
			particlePool.push(tempParticle);
		}
		
		return tempParticle;
	}
	
	this.Update = function (deltaTime) {
		for (var i=0; i<emitterPool.length; i++) {
			if (emitterPool.m_start == false) {
				emitterPool.splice (i, 1);
			}
			else {
				emitterPool[i].Update(deltaTime);
			}
		}
		for (var i=0; i<particlePool.length; i++) {
			particlePool[i].Update(deltaTime);
		}
	}
	
	this.Draw = function (context, x, y, w, h) {
		for (var i=0; i<particlePool.length; i++) {
			particlePool[i].Draw(context, x, y, w, h);
		}
	}
	
	this.Clean = function () {
		particlePool = new Array();
		emitterPool = new Array();
	}
}