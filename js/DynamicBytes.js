//---------------------------------------------------------------
// A dynamic array library. It is designed to combine arrays and data
// and export them as various typed arrays with little hassle.
// (C) 2017 Ian Brehm
//---------------------------------------------------------------
function DynamicBytes() {
	var buffer = [];
	var iterator = 0;
	var eod = false;
	
	var self = this;
	
	//--------------------------------------------------------------------------------
	// Exports bytes. Each value in the array will use 4 bytes each
	self.Export32Bytes = function() {
		var data = Int32Array.from(buffer);
		var bytes = new Int8Array(data.buffer);
		
		return bytes;
	}
	
	//--------------------------------------------------------------------------------
	// Exports bytes. Each value in the array will use 2 bytes each
	self.Export16Bytes = function() {
		var data = Int16Array.from(buffer);
		var bytes = new Int8Array(data.buffer);
		
		return bytes;
	}
	
	//--------------------------------------------------------------------------------
	// Exports bytes. Each value in the array will use 1 byte each
	self.Export8Bytes = function() {
		var data = Uint8Array.from(buffer);
		//var bytes = new Int8Array(data.buffer);
		
		return data;
	}
	
	//--------------------------------------------------------------------------------
	// Just export the array as is
	self.ExportCharArray = function() {
		return buffer;
	}
	
	//--------------------------------------------------------------------------------
	// Import a non-typed array as is
	self.appendCharArray = function(array) {
		buffer = array;
	}
	
	//--------------------------------------------------------------------------------
	// Import any kind of array, adding to the end of the current array
	self.append = function(array) {
		for(var i = 0; i < array.length; i++) {
			buffer[buffer.length] = array[i];
		}
	}
	
	//--------------------------------------------------------------------------------
	// Add a single value to the end of the array
	self.push_back = function(value) {
		buffer[buffer.length] = value;
	}
	
	//--------------------------------------------------------------------------------
	// Take in a 32-bit number and convert it into 4 bytes, adding to the end
	// of the array
	self.push_back32 = function(value) {
		var data = new Int32Array(1);
		data[0] = value;
		data = new Int8Array(data.buffer);
		
		for(var i = 0; i < data.length; i++) {
			buffer[buffer.length] = data[i];
		}
	}
	
	//--------------------------------------------------------------------------------
	// Take in a 16-bit number and convert it into 2 bytes, adding to the end
	// of the array
	self.push_back16 = function(value) {
		var data = new Int16Array(1);
		data[0] = value;
		data = new Int8Array(data.buffer);
		
		for(var i = 0; i < data.length; i++) {
			buffer[buffer.length] = data[i];
		}
	}
	
	//--------------------------------------------------------------------------------
	// Take in a 8-bit number and convert it into 1 bytes, adding to the end
	// of the array
	self.push_back8 = function(value) {
		var data = new Int8Array(1);
		data[0] = value;
		
		for(var i = 0; i < data.length; i++) {
			buffer[buffer.length] = data[i];
		}
	}
	
	//--------------------------------------------------------------------------------
	// Take the next 4 bytes or values in the array and convert them into
	// a single digit.
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
	
	//--------------------------------------------------------------------------------
	// Take the next 2 bytes or values in the array and convert them into
	// a single digit.
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
	
	//--------------------------------------------------------------------------------
	// Take the next 1 byte or value in the array and convert them into
	// a single digit.
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
	
	//--------------------------------------------------------------------------------
	// Grab the next X amount of bytes in the array and return it as a single array
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
	
	//--------------------------------------------------------------------------------
	// Clear the array
	self.clear = function() {
		buffer = [];
	}
	
	//--------------------------------------------------------------------------------
	// Return the length of the array
	self.length = function() {
		return buffer.length;
	}
	
	//--------------------------------------------------------------------------------
	// Return the iterator to the beginning
	self.rewind = function() {
		iterator = 0;
	}
	
	//--------------------------------------------------------------------------------
	// Returns true if the iterator has reached the End of Data.
	self.eod = function() {
		return eod;
	}
}
//---------------------------------------------------------------




































