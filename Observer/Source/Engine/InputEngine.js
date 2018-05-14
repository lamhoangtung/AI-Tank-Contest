var USE_TOUCH = false;

function InputEngine () {
	var TOUCH_DEBUG = false;
	var instance = this;
	
	this.m_canvas = null;
	
	this.m_mouseX = -1;
	this.m_mouseY = -1;
	this.m_mousePress = 0;
	this.m_mouseScale = 1;
	this.m_mouseWheel = 0;
	
	this.m_touchX = new Array();
	this.m_touchY = new Array();
	
	var originMouseX = 0;
	var originMouseY = 0;
	
	
	this.m_keyState = new Array();
	for (var i=0; i<255; i++) {
		this.m_keyState[i] = 0;
	}
	
	
	this.AddEventListener = function (canvas) {
		var temp = canvas;
		var windowOffsetX = 0;
		var windowOffsetY = 0;
		
		if (!navigator.isCocoonJS) {
			while (temp.tagName != 'BODY') {
				windowOffsetY += temp.offsetTop;
				windowOffsetX += temp.offsetLeft;
				temp = temp.offsetParent;
			}
			
			originMouseX = window.pageXOffset - windowOffsetX;
			originMouseY = window.pageYOffset - windowOffsetY;
		}
		
		
		
		canvas.onmousedown = OnMouseDown;
		canvas.onmouseup = OnMouseUp;
		canvas.onmousemove = OnMouseMove;
		
		if (canvas.addEventListener)
			canvas.addEventListener('DOMMouseScroll', OnMouseWheel, false);
			
		canvas.onmousewheel = OnMouseWheel;
		
		canvas.ontouchstart = ProcessTouchEvent;
		canvas.ontouchend = ProcessTouchEvent;
		canvas.ontouchmove = ProcessTouchEvent;
		
		this.m_canvas = canvas;
	}
	
	this.SetMouseScale = function (scale) {
		var temp = this.m_canvas;
		var windowOffsetX = 0;
		var windowOffsetY = 0;
		
		if (!navigator.isCocoonJS) {
			while (temp.tagName != 'BODY') {
				windowOffsetY += temp.offsetTop;
				windowOffsetX += temp.offsetLeft;
				temp = temp.offsetParent;
				if (temp == null) break;
			}
		}
		
		originMouseX = window.pageXOffset - windowOffsetX;
		originMouseY = window.pageYOffset - windowOffsetY;
		
		this.m_mouseScale = scale;
	}
	
	
	function OnMouseWheel (event) {
		if (!event) event = this.m_canvas.event;
		
		if (event.wheelDelta) instance.m_mouseWheel += event.wheelDelta / 120;
		else if (event.detail) instance.m_mouseWheel += -event.detail / 3;
		
		event.preventDefault();
	}
	function OnMouseMove (event) {
		if (!TOUCH_DEBUG) {
			instance.m_mouseX = (originMouseX + event.clientX) * instance.m_mouseScale;
			instance.m_mouseY = (originMouseY + event.clientY) * instance.m_mouseScale;
		}
		else {
			if (instance.m_touchY.length > 0) {
				instance.m_touchX[0] = (originMouseX + event.clientX) * instance.m_mouseScale;
				instance.m_touchY[0] = (originMouseY + event.clientY) * instance.m_mouseScale;
			}
		}
	}
	function OnMouseDown (event) {
		if (!TOUCH_DEBUG) {
			instance.m_mouseX = (originMouseX + event.clientX) * instance.m_mouseScale;
			instance.m_mouseY = (originMouseY + event.clientY) * instance.m_mouseScale;
			instance.m_mousePress = 1;
		}
		else {
			USE_TOUCH = true;
			instance.m_touchX = new Array();
			instance.m_touchY = new Array();
		
			var tempX = (originMouseX + event.clientX) * instance.m_mouseScale;
			var tempY = (originMouseY + event.clientY) * instance.m_mouseScale;
			instance.m_touchX.push (tempX);
			instance.m_touchY.push (tempY);
		}
	}
	function OnMouseUp (event) {
		if (!TOUCH_DEBUG) {
			instance.m_mouseX = (originMouseX + event.clientX) * instance.m_mouseScale;
			instance.m_mouseY = (originMouseY + event.clientY) * instance.m_mouseScale;
			instance.m_mousePress = 0;
		}
		else {
			USE_TOUCH = true;
			instance.m_touchX = new Array();
			instance.m_touchY = new Array();
		}
	}
	function ProcessTouchEvent (event) {
		USE_TOUCH = true;
		
		instance.m_touchX = new Array();
		instance.m_touchY = new Array();
		
		for (var i=0; i<event.touches.length; i++) {
			var tempX = event.touches[i].clientX * instance.m_mouseScale;
			var tempY = event.touches[i].clientY * instance.m_mouseScale;
			instance.m_touchX.push (tempX);
			instance.m_touchY.push (tempY);
		}
	}
	
	
	
	this.ResetWheel = function () {
		this.m_mouseWheel = 0;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	function OnKeyDown (event) {
		var keycode = event.which;
		instance.m_keyState[keycode] = 1;
		/*
		if (keycode != 123) {
			event.preventDefault();
		}
		*/
	}
	function OnKeyUp (event) {
		var keycode = event.which;
		instance.m_keyState[keycode] = 0;
		/*
		if (keycode != 123) {
			event.preventDefault();
		}
		*/
	}
	
	
	
	window.onkeydown  = OnKeyDown;
	window.onkeyup    = OnKeyUp;
}