// ==================================================================
// Utilities
exports.EncodeInt8 = function (number) {
	var arr = new Int8Array(1);
	arr[0] = number;
	return String.fromCharCode(arr[0]);
};
exports.EncodeInt16 = function (number) {
	var arr = new Int16Array(1);
	var char = new Uint8Array(arr.buffer);
	arr[0] = number;
	return String.fromCharCode(char[0], char[1]);
};
exports.EncodeUInt8 = function (number) {
	var arr = new Uint8Array(1);
	arr[0] = number;
	return String.fromCharCode(arr[0]);
};
exports.EncodeUInt16 = function (number) {
	var arr = new Uint16Array(1);
	var char = new Uint8Array(arr.buffer);
	arr[0] = number;
	return String.fromCharCode(char[0], char[1]);
};
exports.EncodeFloat32 = function (number) {
	var arr  = new Float32Array(1);
	var char = new Uint8Array(arr.buffer);
	
	arr[0] = number;
	return String.fromCharCode(char[0], char[1], char[2], char[3]);
};
exports.DecodeInt8 = function (string, offset) {
	var arr  = new Int8Array(1);
	var char = new Int8Array(arr.buffer);
	arr[0] = string.charCodeAt(offset);
	return char[0];
};
exports.DecodeInt16 = function (string, offset) {
	var arr  = new Int16Array(1);
	var char = new Uint8Array(arr.buffer);
	
	for (var i=0; i<2; ++i) {
		char[i] = string.charCodeAt(offset + i);
	}
	return arr[0];
};
exports.DecodeUInt8 = function (string, offset) {
	return string.charCodeAt(offset);
};
exports.DecodeUInt16 = function (string, offset) {
	var arr  = new Uint16Array(1);
	var char = new Uint8Array(arr.buffer);
	
	for (var i=0; i<2; ++i) {
		char[i] = string.charCodeAt(offset + i);
	}
	return arr[0];
};
exports.DecodeFloat32 = function (string, offset) {
	var arr  = new Float32Array(1);
	var char = new Uint8Array(arr.buffer);
	
	for (var i=0; i<4; ++i) {
		char[i] = string.charCodeAt(offset + i);
	}
	return arr[0];
};
exports.PacketToString = function (data) {
	var print = "";
	for (var i=0; i<data.length; i++) {
		print += data.charCodeAt(i) + " ";
	}
	return print;
};
// ==================================================================