//---------------------------------------------------------------
// A dynamic array library. It is designed to combine arrays
// and export them as various typed arrays with little hassle.
//---------------------------------------------------------------
function DynamicBytes() {
	var buffer = [];
	
	var self = this;
	
	// Exports bytes. Each value in the array will use 4 bytes each
	self.Export32Bytes = function() {
		var data = Int32Array.from(buffer);
		var bytes = new Int8Array(data.buffer);
		
		return bytes;
	}
	
	// Exports bytes. Each value in the array will use 2 bytes each
	self.Export16Bytes = function() {
		var data = Int16Array.from(buffer);
		var bytes = new Int8Array(data.buffer);
		
		return bytes;
	}
	
	// Exports bytes. Each value in the array will use 1 byte each
	self.Export8Bytes = function() {
		var data = Int8Array.from(buffer);
		//var bytes = new Int8Array(data.buffer);
		
		return data;
	}
	
	self.ExportCharArray = function() {
		return buffer;
	}
	
	self.set = function(num, value) {
		buffer[num] = value;
	}
	
	self.get = function(num) {
		return buffer[num];
	}
	
	self.append = function(array) {
		for(var i = 0; i < array.length; i++) {
			buffer[buffer.length] = array[i];
		}
	}
	
	self.push_back = function(value) {
		buffer[buffer.length] = value;
	}
	
	self.push_back32 = function(value) {
		var data = new Int32Array(1);
		data[0] = value;
		data = new Int8Array(data.buffer);
		
		for(var i = 0; i < data.length; i++) {
			buffer[buffer.length] = data[i];
		}
	}
	
	self.push_back16 = function(value) {
		var data = new Int16Array(1);
		data[0] = value;
		data = new Int8Array(data.buffer);
		
		for(var i = 0; i < data.length; i++) {
			buffer[buffer.length] = data[i];
		}
	}
	
	self.push_back8 = function(value) {
		var data = new Int8Array(1);
		data[0] = value;
		
		for(var i = 0; i < data.length; i++) {
			buffer[buffer.length] = data[i];
		}
	}
	
	self.get32 = function() {
		
	}
	
	self.clear = function() {
		buffer = [];
	}
	
	self.length = function() {
		return buffer.length;
	}
}
//---------------------------------------------------------------




































