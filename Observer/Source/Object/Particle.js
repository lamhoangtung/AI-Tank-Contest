function ParticleDef() {
	this.CreatePlaneSmokeEmitter = function () {
		var source = new SourceRect(0, 0, 0, 50, 50);
		source.m_id = g_graphicEngine.LoadImage("Image/Particle/WhiteSmoke.png");
		
		var particle = new Particle();
		particle.m_sourceRectArray[0] = source;
		particle.m_resistant = 0.05;
		particle.m_fadeSpeed = -0.001;
		particle.m_alpha = 0.5;
		particle.m_w = 50;
		particle.m_h = 50;
		particle.m_lifeTime = 500;
		particle.m_drawAdd = false;
		
		var emitter = g_particleEngine.CreateEmitter();
		emitter.SetSampleParticle (particle);
		emitter.m_randomizeAngleMin = 0;
		emitter.m_randomizeAngleMax = 360;
		emitter.m_randomizeRotateSpeedMin = -0.1;
		emitter.m_randomizeRotateSpeedMax = 0.1;
		emitter.m_randomizeScaleMin = 0.8;
		emitter.m_randomizeScaleMax = 0.8;
		emitter.m_emitRate = 0.1;
		emitter.Start();
		
		return emitter;
	}
	
	this.CreateTankSmokeEmitter = function () {
		var source = new SourceRect(0, 0, 0, 50, 50);
		source.m_id = g_graphicEngine.LoadImage("Image/Particle/BlackSmoke.png");
		
		var particle = new Particle();
		particle.m_sourceRectArray[0] = source;
		particle.m_resistant = 0.05;
		particle.m_fadeSpeed = -0.001;
		particle.m_alpha = 0.6;
		particle.m_w = 50;
		particle.m_h = 50;
		particle.m_lifeTime = 1000;
		particle.m_drawAdd = false;
		particle.m_scaleSpeed = 0.003;
		
		var emitter = g_particleEngine.CreateEmitter();
		emitter.SetSampleParticle (particle);
		emitter.m_randomizeAngleMin = 0;
		emitter.m_randomizeAngleMax = 360;
		emitter.m_randomizeRotateSpeedMin = -0.01;
		emitter.m_randomizeRotateSpeedMax = 0.01;
		emitter.m_randomizeScaleMin = 0.2;
		emitter.m_randomizeScaleMax = 0.3;
		emitter.m_emitForceMin = 0;
		emitter.m_emitForceMax = 2;
		emitter.m_emitAngleStart = 0;
		emitter.m_emitAngleEnd = 360;
		emitter.m_emitRate = 0.1;
		emitter.Start();
		
		return emitter;
	}
	
	this.CreateBulletSmokeEmitter = function () {
		var source = new SourceRect(0, 0, 0, 50, 50);
		source.m_id = g_graphicEngine.LoadImage("Image/Particle/WhiteSmoke.png");
		
		var particle = new Particle();
		particle.m_sourceRectArray[0] = source;
		particle.m_resistant = 0.05;
		particle.m_fadeSpeed = -0.001;
		particle.m_alpha = 0.5;
		particle.m_w = 50;
		particle.m_h = 50;
		particle.m_lifeTime = 500;
		particle.m_drawAdd = false;
		
		var emitter = g_particleEngine.CreateEmitter();
		emitter.SetSampleParticle (particle);
		emitter.m_randomizeAngleMin = 0;
		emitter.m_randomizeAngleMax = 360;
		emitter.m_randomizeRotateSpeedMin = -0.1;
		emitter.m_randomizeRotateSpeedMax = 0.1;
		emitter.m_randomizeScaleMin = 0.4;
		emitter.m_randomizeScaleMax = 0.4;
		emitter.m_emitRate = 0.05;
		emitter.Start();
		
		return emitter;
	}
	
	this.CreateShellTrailEmitter = function () {
		var source = new SourceRect(0, 0, 0, 50, 50);
		source.m_id = g_graphicEngine.LoadImage("Image/Particle/HotTrail.png");
		
		var particle = new Particle();
		particle.m_sourceRectArray[0] = source;
		particle.m_resistant = 0.005;
		particle.m_fadeSpeed = -0.002;
		particle.m_alpha = 1;
		particle.m_w = 50;
		particle.m_h = 50;
		particle.m_lifeTime = 500;
		particle.m_drawAdd = true;
		particle.m_scaleSpeed = -0.002
		
		var emitter = g_particleEngine.CreateEmitter();
		emitter.SetSampleParticle (particle);
		emitter.m_randomizeAngleMin = 0;
		emitter.m_randomizeAngleMax = 360;
		emitter.m_randomizeRotateSpeedMin = -0.1;
		emitter.m_randomizeRotateSpeedMax = 0.1;
		emitter.m_randomizeScaleMin = 0.8;
		emitter.m_randomizeScaleMax = 0.8;
		emitter.m_emitForceMin = 0.1;
		emitter.m_emitForceMax = 0.12;
		emitter.m_emitRate = 0.06;
		emitter.Start();
		
		return emitter;
	}
	
	this.CreateFragScatteringEmitter = function () {
		var source = new SourceRect(0, 0, 0, 50, 50);
		source.m_id = g_graphicEngine.LoadImage("Image/Particle/Frag.png");
		
		var particle = new Particle();
		particle.m_sourceRectArray[0] = source;
		particle.m_resistant = 0.001;
		particle.m_fadeSpeed = -0.001;
		particle.m_alpha = 1;
		particle.m_w = 50;
		particle.m_h = 50;
		particle.m_lifeTime = 1000;
		particle.m_drawAdd = true;
		
		var emitter = g_particleEngine.CreateEmitter();
		emitter.SetSampleParticle (particle);
		emitter.m_randomizeAngleMin = 0;
		emitter.m_randomizeAngleMax = 360;
		emitter.m_randomizeRotateSpeedMin = -0.2;
		emitter.m_randomizeRotateSpeedMax = 0.2;
		emitter.m_randomizeScaleMin = 0.2;
		emitter.m_randomizeScaleMax = 0.5;
		emitter.m_emitForceMin = 0.2;
		emitter.m_emitForceMax = 0.4;
		emitter.m_emitRate = 0.05;
		emitter.Start();
		
		return emitter;
	}
}