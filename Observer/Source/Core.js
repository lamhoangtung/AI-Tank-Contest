var CANVAS_W = 1180;
var CANVAS_H = 880;

var g_canvas           	= null;
var g_context         	= null;
var g_graphicEngine    	= null;
var g_particleEngine   	= null;
var g_inputEngine      	= null;
var g_stateEngine      	= null;
var g_soundEnding		= null;

var g_particle			= null;

function CreateCanvas() {
	g_canvas = document.createElement("canvas");
	
	if (navigator.isCocoonJS) {
		g_canvas.screencanvas = true;
	}
	
	g_context = g_canvas.getContext("2d");
	g_canvas.width  = CANVAS_W;
	g_canvas.height = CANVAS_H;
	g_canvas.style.position = "absolute";
	document.body.appendChild (g_canvas);
}

function ResizeCanvas () {
	var windowW = 0;
	var windowH = 0;
	var canvasW = 0;
	var canvasH = 0;
	var canvasT = 0;
	var canvasL = 0;
	var touchScale = 0;
	
	if (window.innerWidth) windowW = window.innerWidth;
	else if (document.documentElement && document.documentElement.clientWidth) windowW = document.documentElement.clientWidth;
	else if (document.body)	windowW = document.body.clientWidth;

	if (window.innerHeight) windowH = window.innerHeight;
	else if (document.documentElement && document.documentElement.clientHeight) windowH = document.documentElement.clientHeight;
	else if (document.body) windowH = document.body.clientHeight;
	
	canvasH = (windowH < windowW * (CANVAS_H / CANVAS_W))? windowH : ((windowW * (CANVAS_H / CANVAS_W) + 0.5) >> 0);
	canvasW = (canvasH * (CANVAS_W / CANVAS_H) + 0.5) >> 0;
	
	if (canvasW > CANVAS_W) {
		canvasW = CANVAS_W;
		canvasH = CANVAS_H;
	}
	
	canvasT = 0;
	canvasL = (windowW - canvasW) * 0.5;
	
	
	g_canvas.style.width  = canvasW + "px";
	g_canvas.style.height = canvasH + "px";
	g_canvas.style.top = canvasT + "px";
	g_canvas.style.left = canvasL + "px";
	
	touchScale = 1 / (canvasW / CANVAS_W);
	
	if (g_inputEngine) g_inputEngine.SetMouseScale (touchScale);
}


function Init() {
	g_graphicEngine  = new GraphicEngine();
	g_particleEngine = new ParticleEngine();
	g_inputEngine    = new InputEngine();
	g_stateEngine    = new StateEngine();
	g_soundEngine 	 = new SoundEngine();
	
	g_particleDef	 = new ParticleDef();
	
	CreateCanvas();
	g_inputEngine.AddEventListener (g_canvas);
	ResizeCanvas();
	
	g_stateEngine.SetContext(g_context, g_graphicEngine);
	g_particleEngine.SetContext(g_context, g_graphicEngine);
	
	window.onresize = ResizeCanvas;
}

Init();

