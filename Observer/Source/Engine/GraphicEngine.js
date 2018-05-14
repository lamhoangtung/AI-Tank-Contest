function GraphicEngine () {
	var DEG_TO_RAD = 0.0174532925199433;
	
	
	// Instance pointer
	var instance = this;
	
	
	//============================== IMAGE LOADER ===================================
	var imageNumber = 0;                 // Number of image in the array
	var imageLoadedNumber = 0;           // Number of completely loaded image
	var imageObjectArray = new Array();  // Image object array
	var imagePathArray = new Array();    // The path of the image array
	
	var globalAlpha = 1;
	
	
	// Load an image right away ----------------------------------------
	this.LoadImage = function (path) {
		// Check if that image was already existed. Return id if existed.
		for (var i=0; i<imageNumber; i++) {
			if (imagePathArray[i] == path) {
				return i;
			}
		}
		
		// If not existed, load it
		imagePathArray[imageNumber] = path;
		imageObjectArray[imageNumber] = new Image();
		imageObjectArray[imageNumber].src = path;
		imageObjectArray[imageNumber].onload = function () {
			imageLoadedNumber ++;
		}
		
		// Return id
		return imageNumber++;
	}
	// ------------------------------------------------------------------
	
	
	
	
	// Get image by ID --------------------------------------------------
	this.GetImage = function (id) {
		return imageObjectArray[id];
	}
	// ------------------------------------------------------------------
	
	
	
	
	// Load an image when network is free -------------------------------
	this.LoadImageWhenNetworkFree = function (path) {
		
	}
	// ------------------------------------------------------------------
	
	
	// Get image loading progress, return from 0 to 1 -------------------
	this.GetLoadingProgress = function () {
		return imageLoadedNumber / imageNumber;
	}
	// ------------------------------------------------------------------
	
	//============================== IMAGE LOADER ===================================
	
	
	
	
	
	
	//================================ RENDERER =====================================
	this.SetGlobalAlpha = function (alpha) {
		globalAlpha = alpha;
	}
	
	// Clear entire canvas or a portion of it ---------------------------
	this.ClearCanvas = function (canvas, context, x, y, w, h) {
		if (x == null) x = 0;
		if (y == null) y = 0;
		if (w == null) w = CANVAS_W;
		if (h == null) x = CANVAS_H;
		
		if (x < 0) x = 0;
		if (y < 0) y = 0;
		if (x + w > canvas.width) x = canvas.width - w;
		if (y + h > canvas.height) y = canvas.height - h;
		
		context.clearRect(x, y, w, h);
	}
	// ------------------------------------------------------------------
	
	
	this.CopyCanvas = function (desContext, sourceCanvas, sx, sy, sw, sh, dx, dy, dw, dh, alpha) {
		if (sw == null) sw = sourceCanvas.width;
		if (sh == null) sh = sourceCanvas.height;
		if (dw == null) dw = sourceCanvas.width;
		if (dh == null) dh = sourceCanvas.height;
		
		if (sx < 0) sx = 0;
		if (sy < 0) sy = 0;
		if (sx + sw > sourceCanvas.width) sx = sourceCanvas.width - sw;
		if (sy + sh > sourceCanvas.height) sy = sourceCanvas.height - sh;
		
		if (alpha == null) alpha = 1;
		if (alpha > 1) alpha = 1;
		if (alpha < 0) alpha = 0;
		
		if (alpha * globalAlpha > 0) {
			desContext.globalAlpha = alpha * globalAlpha;
			desContext.drawImage (sourceCanvas, sx, sy, sw, sh, dx, dy, dw, dh);
			desContext.globalAlpha = globalAlpha;
		}
	}
	
	
	this.FillCanvas = function (context, r, g, b, alpha, x, y, w, h) {
		if (x == null) x = 0;
		if (y == null) y = 0;
		if (w == null) w = CANVAS_W;
		if (h == null) h = CANVAS_H;
		
		if (alpha == null) alpha = 1;
		if (alpha > 1) alpha = 1;
		if (alpha < 0) alpha = 0;
		
		context.globalAlpha = alpha * globalAlpha;
		context.fillStyle = "rgb(" + r + "," +  g + "," +  b + ")"; 
		context.fillRect(x, y, w, h);
		context.globalAlpha = globalAlpha;
	}
	
	// Draw a loaded image to the canvas context ------------------------
	this.Draw = function (context, imageID, sx, sy, sw, sh, dx, dy, dw, dh, alpha, flipX, flipY, angle, cx, cy) {
		if (alpha == null) alpha = 1;
		
		if (alpha > 1) alpha = 1;
		if (alpha < 0) alpha = 0;
		
		if (flipX == null) flipX = 0;
		if (flipY == null) flipY = 0;
		if (angle == null) angle = 0;
		
		
		
		var image = this.GetImage (imageID);
		
		var save = angle || flipX || flipY;
		
		if (save) context.save();
		
		var signX = (flipX == 0)? 1 : -1;
		var signY = (flipY == 0)? 1 : -1;
		
		if (flipX == 0 && flipY == 0) {
			
		}
		else if (flipX == 1 && flipY == 1) {
			context.translate (sw, sh);
			context.scale (-1, -1);
		}
		else if (flipX == 1 && flipY == 0) {
			context.translate (sw, 0);
			context.scale (-1, 1);
		}
		else if (flipX == 0 && flipY == 1) {
			context.translate (0, sh);
			context.scale (1, -1);
		}
		
		
		if (cx == null) cx = dw * 0.5;
		if (cy == null) cy = dh * 0.5;
		var centerX = dx + cx;
		var centerY = dy + cy;
		
		
		if (angle != 0) {
			if (flipX == 0 && flipY == 0) {
				context.translate (centerX, centerY);
				context.rotate (angle * DEG_TO_RAD * signX * signY);
				context.translate (-centerX, -centerY);
			}
			else if (flipX == 1 && flipY == 0) {
				context.translate (sw - centerX, centerY);
				context.rotate (angle * DEG_TO_RAD * signX * signY);
				context.translate (- sw + centerX, -centerY);
			}
			else if (flipX == 0 && flipY == 1) {
				context.translate (centerX, sh - centerY);
				context.rotate (angle * DEG_TO_RAD * signX * signY);
				context.translate (-centerX, - sh + centerY);
			}
			else if (flipX == 1 && flipY == 1) {
				context.translate (sw - centerX, sh - centerY);
				context.rotate (angle * DEG_TO_RAD * signX * signY);
				context.translate (- sw + centerX, - sh + centerY);
			}
		}
		
		dx = dx * signX;
		dy = dy * signY;
		
		
		if (dw > 0 && dh > 0) {
			context.globalAlpha = alpha * globalAlpha;
			context.drawImage (image, sx, sy, sw, sh, dx, dy, dw, dh);
			context.globalAlpha = globalAlpha;
		}
		
		
		if (save) context.restore();
	}
	// ------------------------------------------------------------------
	
	
	// Draw an image quickly without setting param ----------------------
	this.DrawFast = function (context, imageID, dx, dy) {
		var image = this.GetImage (imageID);
		context.globalAlpha = globalAlpha;
		context.drawImage (image, 0, 0, image.width, image.height, dx, dy, image.width, image.height);
		context.globalAlpha = 1;
	}
	// ------------------------------------------------------------------
	
	
	// Set draw mode
	this.SetDrawModeAddActive = function (context, active) {
		if (active == true) {
			context.globalCompositeOperation = "lighter";
		}
		else {
			context.globalCompositeOperation = "source-over";
		}
	}
	
	
	// Draw text --------------------------------------------------------
	// Draw text with RGB color value.
	var LINE_HEIGHT = 1.5;
	
	
	this.DrawTextRGB = function (context, text, x, y, w, font, size, bold, italic, alignW, alignH, red, green, blue, alpha, breakLine, stroke, strokeR, strokeG, strokeB)
	{
		if (alpha == null) alpha = 1;
		if (alpha < 1) {
			context.globalAlpha = alpha * globalAlpha;
		}
		
		if (font == null) font = "sans-serif";
		if (size == null) size = "12";
		if (bold == true) 
			bold = "bold";
		else
			bold = "";
		if (italic == true) 
			italic = "italic";
		else
			italic = "";
			
		if (alignW == null) alignW = "left";
		if (alignH == null) alignH = "top";
		
		if (breakLine == null) breakLine = false;
		
		
		var found = false;
		if (navigator.isCocoonJS) {
			for (var i=0; i<textRequest.length; i++) {
				if (textRequest[i].Compare (text, w, font, size, bold, italic, alignW, alignH, red, green, blue, breakLine) == true) {
					if (alignW == "left")
						context.drawImage (textRequest[i].m_canvas, 0, 0, textRequest[i].m_canvas.width, textRequest[i].m_canvas.height, x, y - size * LINE_HEIGHT, textRequest[i].m_canvas.width, textRequest[i].m_canvas.height);
					else if (alignW == "center")
						context.drawImage (textRequest[i].m_canvas, 0, 0, textRequest[i].m_canvas.width, textRequest[i].m_canvas.height, x - w * 0.5, y - size * LINE_HEIGHT, textRequest[i].m_canvas.width, textRequest[i].m_canvas.height);
					else if (alignW == "right")
						context.drawImage (textRequest[i].m_canvas, 0, 0, textRequest[i].m_canvas.width, textRequest[i].m_canvas.height, x - w, y - size * LINE_HEIGHT, textRequest[i].m_canvas.width, textRequest[i].m_canvas.height);
					found = true;
					break;
				}
			}
		}
		
		
		if (!found) {
			var lineArray = new Array();
			if (breakLine == true) {
				context.textAlign = alignW;
				context.textBaseline = alignH;
				context.font = bold + " " + italic + " " + size + "px " + font;
				context.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
				
				
				if (context.measureText(text).width < w) {
					lineArray.push (text);
				}
				else {
					// Do lines breaking
					var i              = 0;
					var line           = 0;
					var currentLength  = 0;
					var drawString     = "";
					var tempString     = "";
					var remainString   = text;
					
					while (remainString.length > 0) {
						for (i=0; i<=remainString.length; i++) {
							if (i == remainString.length) {
								if (currentLength + context.measureText(tempString).width < w) {
									lineArray.push (drawString + remainString);
									remainString = "";
								}
								else {
									lineArray.push (drawString);
									lineArray.push (remainString);
									remainString = "";
								}
								
							}
							if (remainString.charCodeAt(i) == 32) {
								tempString = remainString.substr(0, i+1);
								if (currentLength + context.measureText(tempString).width < w) {
									drawString += tempString;
									currentLength += context.measureText(tempString).width;
									remainString = remainString.substr(i+1);
								}
								else {
									if (currentLength == 0) {
										remainString = "";
									}
									else {
										lineArray.push (drawString);
										drawString = "";
										currentLength = 0;
									}
								}
								break;
							}
							else if (remainString.charCodeAt(i) == 47) {
								if (remainString.charCodeAt(i + 1) == 110) {
									lineArray.push (drawString);
									drawString = "";
									currentLength = 0;
									remainString = remainString.substr(i+2);
								}
							}
						}
					}
				}
			}
			else {
				lineArray.push (text);
			}
			
			
			if (navigator.isCocoonJS) {
				var h = (lineArray.length + 1) * size * LINE_HEIGHT;
				var temp = new DrawTextRequest(text, w, font, size, bold, italic, alignW, alignH, red, green, blue, breakLine, stroke, strokeR, strokeG, strokeB);
				temp.m_canvas = document.createElement("canvas");
				temp.m_canvas.width = w;
				temp.m_canvas.height = h;
				var tempContext = temp.m_canvas.getContext("2d");
				
				tempContext.textAlign = alignW;
				tempContext.textBaseline = alignH;
				tempContext.font = bold + " " + italic + " " + size + "px " + font;
				tempContext.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
				if (stroke)
					tempContext.strokeStyle = "rgb(" + strokeR + "," + strokeG + "," + strokeB + ")";
				
				for (var i=0; i<lineArray.length; i++) {
					if (alignW == "left") {
						tempContext.fillText (lineArray[i], 0, (i + 1) * size * LINE_HEIGHT);
						if (stroke)
							tempContext.strokeText (lineArray[i], 0, (i + 1) * size * LINE_HEIGHT);
					}
					else if (alignW == "center") {
						tempContext.fillText (lineArray[i], w * 0.5, (i + 1) * size * LINE_HEIGHT);
						if (stroke)
							tempContext.strokeText (lineArray[i], w * 0.5, (i + 1) * size * LINE_HEIGHT);
					}
					else if (alignW == "right") {
						tempContext.fillText (lineArray[i], w, (i + 1) * size * LINE_HEIGHT);
						if (stroke)
							tempContext.strokeText (lineArray[i], w, (i + 1) * size * LINE_HEIGHT);
					}
				}
				
				if (alignW == "left")
					context.drawImage (temp.m_canvas, 0, 0, w, h, x, y - size * LINE_HEIGHT, w, h);
				else if (alignW == "center")
					context.drawImage (temp.m_canvas, 0, 0, w, h, x - w * 0.5, y - size * LINE_HEIGHT, w, h);
				else if (alignW == "right")
					context.drawImage (temp.m_canvas, 0, 0, w, h, x - w, y - size * LINE_HEIGHT, w, h);
				
				textRequest.push(temp);
			}
			else {
				context.textAlign = alignW;
				context.textBaseline = alignH;
				context.font = bold + " " + italic + " " + size + "px " + font;
				context.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
				if (stroke)
					context.strokeStyle = "rgb(" + strokeR + "," + strokeG + "," + strokeB + ")";
				
				for (var i=0; i<lineArray.length; i++) {
					context.fillText (lineArray[i], x, y + i * size * LINE_HEIGHT);
					if (stroke)
						context.strokeText (lineArray[i], x, y + i * size * LINE_HEIGHT);
				}
			}
		}
		
		if (alpha < 1) {
			context.globalAlpha = globalAlpha;
		}
	};
	// ------------------------------------------------------------------
	
	
	this.DrawCircle = function (context, centerX, centerY, radius, lineWidth, red, green, blue, alpha) {
		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.lineWidth = lineWidth;
		context.strokeStyle = "rgba(" + red + "," + green + "," + blue + "," + alpha+ ")";
		context.stroke();
	}
	
	this.DrawRect = function (context, x, y, w, h, lineWidth, red, green, blue, alpha) {
		context.beginPath();
		context.rect(x, y, w, h);
		context.lineWidth = lineWidth;
		context.strokeStyle = "rgba(" + red + "," + green + "," + blue + "," + alpha+ ")";
		context.stroke();
	}
}



function DrawTextRequest (text, w, font, size, bold, italic, alignW, alignH, red, green, blue, breakLine, stroke, strokeR, strokeG, strokeB) {
	this.m_text = text;
	this.m_w = w;
	this.m_font = font;
	this.m_size = size;
	this.m_bold = bold;
	this.m_italic = italic;
	this.m_alignW = alignW;
	this.m_alignH = alignH;
	this.m_red = red;
	this.m_green = green;
	this.m_blue = blue;
	this.m_breakLine = breakLine;
	this.m_canvas = null;
	this.m_stroke = stroke;
	this.m_strokeR = strokeR;
	this.m_strokeG = strokeG;
	this.m_strokeB = strokeB;
	
	
	this.Compare = function (text, w, font, size, bold, italic, alignW, alignH, red, green, blue, breakLine, stroke, strokeR, strokeG, strokeB) {
		if (this.m_text == text &&
			this.m_w == w &&
			this.m_font == font &&
			this.m_size == size &&
			this.m_bold == bold &&
			this.m_italic == italic &&
			this.m_alignW == alignW &&
			this.m_alignH == alignH &&
			this.m_red == red &&
			this.m_green == green &&
			this.m_blue == blue &&
			this.m_breakLine == breakLine &&
			this.m_stroke == stroke &&
			this.m_strokeR == strokeR &&
			this.m_strokeG == strokeG &&
			this.m_strokeB == strokeB) {
				return true;
		}
	}
}

var textRequest = new Array();