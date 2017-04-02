//---------------------------------------------------------------
// A dynamic array library. It is designed to combine arrays
// and export them as various typed arrays with little hassle.
//---------------------------------------------------------------
function DynamicBytes() {
	var buffer = [];
	var iterator = 0;
	var eod = false;
	
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
		var data = Uint8Array.from(buffer);
		//var bytes = new Int8Array(data.buffer);
		
		return data;
	}
	
	self.ExportCharArray = function() {
		return buffer;
	}
	
	self.appendCharArray = function(array) {
		buffer = array;
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
		var data = new Int8Array(4);
		
		for(var i = 0; i < data.length; i++) {
			data[i] = buffer[iterator];
			iterator++;
			
			if(iterator == buffer.length) {
				eod = true;
				break;
			}
		}
		
		var rtrn = new Int32Array(data.buffer);
		
		return rtrn[0];
	}
	
	self.get16 = function() {
		var data = new Int8Array(2);
		
		for(var i = 0; i < data.length; i++) {
			data[i] = buffer[iterator];
			iterator++;
			
			if(iterator == buffer.length) {
				eod = true;
				break;
			}
		}
		
		var rtrn = new Int16Array(data.buffer);
		
		return rtrn[0];
	}
	
	self.get8 = function() {
		var data = new Int8Array(1);
		
		for(var i = 0; i < data.length; i++) {
			data[i] = buffer[iterator];
			iterator++;
			
			if(iterator == buffer.length) {
				eod = true;
				break;
			}
		}
		
		var rtrn = new Int8Array(data.buffer);
		
		return rtrn[0];
	}
	
	self.getUBytes = function(amount) {
		var data = new Uint8Array(amount);
		
		for(var i = 0; i < data.length; i++) {
			data[i] = buffer[iterator];
			iterator++;
			
			if(iterator == buffer.length) {
				eod = true;
				break;
			}
		}
		
		return data;
	}
	
	self.clear = function() {
		buffer = [];
	}
	
	self.length = function() {
		return buffer.length;
	}
	
	self.rewind = function() {
		iterator = 0;
	}
	
	self.eod = function() {
		return eod;
	}
}
//---------------------------------------------------------------




































