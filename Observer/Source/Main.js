// The network object, handle the socket stuff
var g_network;
var g_replay;
// What state do we need?
var g_gsLoader;
var g_gsActionPhase;


function LoadAllState () {
	// Create, but not connect yet
	if (g_replayFileName == "") {
		g_network = new Network(g_serverHost, g_serverPort);
	}
	else {
		g_replay = new Replay(g_replayFileName);
	}
	
	// State
	g_gsActionPhase = new GSActionPhase();
	g_gsActionPhase.Init();
}


function GoToLoaderState () {
	g_gsLoader = new GSLoader();
	g_gsLoader.Init();
	g_stateEngine.SwitchState (g_gsLoader, 0);
}

function GoToActionPhase() {
	g_gsActionPhase.Init();
	g_stateEngine.SwitchState (g_gsActionPhase, 1);
}


g_stateEngine.Start();

GoToLoaderState();