var fs = require("fs");

module.exports = function Logger () {
	var instance = this;
	var wstream = null;

	this.startLogfile = function (path) {
		instance.wstream = fs.createWriteStream(path);
	}
	
	this.print = function (string) {
		if (instance.wstream != null)
			instance.wstream.write(string + "\r\n");
		else
			console.log(string)
	}
	
	this.closeLogfile = function () {
		if (instance.wstream != null) {
			instance.wstream.end();
			instance.wstream = null;
		}
	}
}