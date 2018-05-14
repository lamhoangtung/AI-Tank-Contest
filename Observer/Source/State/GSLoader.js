function GSLoader () {
	var STATE_LOADING_OWN_ASSETS = 0;
	var STATE_LOADING_OTHERS_ASSETS = 1;
	var STATE_CONNECT_TO_SERVER = 2;
	var STATE_ALL_DONE = 3;
	
	var init = false;
	var imgSplash = null;
	
	var state = STATE_LOADING_OWN_ASSETS;
	
	this.Init = function () {
		if (init == false) {
			imgSplash = g_graphicEngine.LoadImage("Image/Splash.png");
			
			init = true;
		}
	}
	
	this.Update = function (deltaTime) {
		switch (state) {
			case STATE_LOADING_OWN_ASSETS:
				if (g_graphicEngine.GetLoadingProgress() == 1) {
					state = STATE_LOADING_OTHERS_ASSETS;
					LoadAllState();
				}
				break;
			case STATE_LOADING_OTHERS_ASSETS:
				if (g_graphicEngine.GetLoadingProgress() == 1) {
					state = STATE_CONNECT_TO_SERVER;
					if (g_replayFileName == "") {
						g_network.Connect();
					}
					else {
						GoToActionPhase();
					}
				}
				break;
			case STATE_CONNECT_TO_SERVER:
				if (g_replayFileName == "" && g_network.GetStatus() == SOCKET_CONNECTED) {
					state = STATE_ALL_DONE;
				}
				break;
			case STATE_ALL_DONE:
				GoToActionPhase();
				break;
		}
	}
	
	this.Draw = function () {
		g_graphicEngine.DrawFast (g_context, imgSplash, 0, 0);
	}
}