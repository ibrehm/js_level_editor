function Compress() {
	var self = this;
	
	self.deflate = function(data) {
		
		var temp = new DynamicBytes();
		
		var current = data[0];
		var count = 1;
		var i = 1;
		
		while(i < data.length) {
			if(data[i] == current) {
				count++;
			} else {
				temp.push_back16(current);
				temp.push_back32(count);
				
				count = 1;
				current = data[i];
			}
			i++;
			
		}
		
		if(count > 0) {
			temp.push_back16(current);
			temp.push_back32(count);
		}
		
		var rtrn = temp.Export8Bytes();
		
		return rtrn;
		
	};
	
	self.inflate = function(data, length) {
		var rtrn = new Int16Array( length );
		var iterator = 0;
		
		var temp = new DynamicBytes();
		temp.append(data);
		
		for(var i = 0; i < temp.length(); i+=2) {
			var tile = temp.get16();
			var amount = temp.get32();
			
			for(var j = 0; j < amount; j++) {
				rtrn[iterator] = tile;
				iterator++;
			}
		}
		
		return rtrn;
	}
}
var MapCompress = new Compress();
