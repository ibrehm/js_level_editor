//---------------------------------------------------------------
function Node() {
	self = this;
	
	self.data = null;
	self.Next = null;
	self.Prev = null;
}
//---------------------------------------------------------------
function List() {
	self = this;
	
	var iterator = -1;
	
	var front = null;
	var current = null;
	var end = null;
	this.length = 0;
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	
	function GetObj(pos) {
		var count = 0;
		var obj = front;
		var direction = 1;
		
		alert(self.length);
		
		if(location > (self.length/2) ) {
			count = (self.length-1);
			obj = end;
			direction = -1;
		}
		
		var check = (location >= 0) && (location < self.length);
		
		if( (front != null) && check) {
			
			while(true) {
				if(count == location) {
					break;
				} else {
					if(direction == -1) {
						obj = obj.Prev;
					} else {
						obj = obj.Next;
					}
					count += direction;
				}
			}
			
		}
		
		return obj;
	}
	
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	
	self.push_back = function(obj) {
		var temp = new Node();
		
		if(this.length == 0) {
			front = temp;
			current = temp;
			end = temp;
		} else {
			end.Next = temp;
			temp.Prev = end;
			
			end = temp;
		}
		
		temp.data = obj;
		this.length++;
	}
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	self.push_front = function(obj) {
		var temp = new Node();
		
		if(this.length == 0) {
			front = temp;
			current = temp;
			end = temp;
		} else {
			front.Prev = temp;
			temp.Next = front;
			
			front = temp;
		}
		
		temp.data = obj;
		this.length++;
	}
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	self.insert = function(pos, obj) {
		if((this.length == 0) || (pos == 0)) {
			this.push_front(obj);
		} else {
			if(pos >= this.length) {
				this.push_back(obj);
			} else {
				var count = 0;
				var finder = front;
				
				while(count < this.length) {
					
					if(count == pos) {
						var temp = new Node();
						temp.data = obj;
						
						finder.Prev.Next = temp;
						temp.Prev = finder.Prev;
						temp.Next = finder;
						finder.Prev = temp;
						
						this.length++;
						
						break;
					}
					finder = finder.Next;
					count++;
				}
			}
		}
	}
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	self.remove = function(location) {
		var count = 0;
		var obj = front;
		var direction = 1;
		
		if(location > (this.length/2) ) {
			count = (this.length-1);
			obj = end;
			direction = -1;
		}
		
		var check = (location >= 0) && (location < this.length);
		
		if( (front != null) && check) {
			
			while((count < this.length) && (count >= 0)) {
				if(count == location) {
					if(this.length > 1) {
						if(count == 0) {
							front = obj.Next;
							front.Prev = null;
						} else if(count == (this.length-1)) {
							end = obj.Prev;
							end.Next = null;
						} else {
							obj.Next.Prev = obj.Prev;
							obj.Prev.Next = obj.Next;
						}
					}
					
					delete obj;
					this.length--;
					
					break;
				}
				if(direction == -1) {
					obj = obj.Prev;
				} else {
					obj = obj.Next;
				}
				count += direction;
			}
			
		}
	}
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	self.pop_back = function() {
		var pos = this.length-1;
		this.remove(pos);
	}
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	self.Clear = function() {
		while(this.length > 0) {
			this.remove(0);
		}
	}
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	self.get = function(location) {
		//var obj = GetObj(location);
		
		var count = 0;
		var obj = front;
		var direction = 1;
		
		if(location > (this.length/2) ) {
			count = (this.length-1);
			obj = end;
			direction = -1;
		}
		
		var check = (location >= 0) && (location < this.length);
		
		if( (front != null) && check) {
			
			while(true) {
				if(count == location) {
					break;
				} else {
					if(direction == -1) {
						obj = obj.Prev;
					} else {
						obj = obj.Next;
					}
					count += direction;
				}
			}
			
		}
		
		return obj.data;
	}
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	self.set = function(location, value) {
		var obj = GetObj(location);
		obj.data = value;
	}
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	self.find = function(value) {
		
		var rtrn = -1;
		var obj = front;
		
		var i = 0;
		while(i < this.length) {
			if(obj.data == value) {
				rtrn = i;
				break;
			}
			obj = obj.Next;
			i++;
		}
		
		return rtrn;
		
	}
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	self.generateArray = function() {
		var rtrn = [];
		var obj = front;
		
		var i = 0;
		while(i < this.length) {
			rtrn[rtrn.length] = obj.data;
			obj = obj.Next;
			i++;
		}
		
		return rtrn;
	}
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	self.appendArray = function(array) {
		var i = 0;
		while(i < array.length) {
			this.push_back(array[i]);
			i++;
		}
	}
}
//---------------------------------------------------------------




































