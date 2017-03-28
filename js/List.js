//---------------------------------------------------------------
// A Linked List library. Usage example:
//
// var list = new List();
// list.push_back(50);     // Adds '50' to the list
// list.get(0);            // Get the element in position 0. Returns 50.
// list.remove(0);         // Deletes the number. Could also have used list.pop_back() in this case.
//---------------------------------------------------------------
function Node() {
	self = this;
	
	self.data = null;
	self.Next = null;
	self.Prev = null;
}
//---------------------------------------------------------------
function List() {
	
	var self = this;
	
	var iterator = -1;
	
	var front = null;
	var current = null;
	var end = null;
	this.length = 0;
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Finds an object based on the desired location
	function GetObj(location) {
		
		if(location != iterator) {
			
			var count = 0;
			var direction = 1;
			var obj = null;
			
			// Find nearest nodes out of front/end/current
			var start = Infinity;
			if(Math.abs(location - 0) < start) {
				obj = front;
				start = Math.abs(location - 0);
			}
			
			if(Math.abs(location - (self.length-1)) < start) {
				obj = end;
				start = Math.abs(location - (self.length-1));
				count = (self.length-1);
			}
			
			if(Math.abs(location - iterator) < start) {
				obj = current;
				count = iterator;
			}
			
			// Go backwards if it's lower
			if(location < count ) {
				direction = -1;
			}
			
			//var check = ((location >= 0) && (location < self.length));
			
			//if( (front != null) && check) {
			if((location >= 0) && (location < self.length)) {
				
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
			current = obj;
			iterator = count;
		}
		
		return current;
	};
	
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Return's the current position of the iterator
	self.itrPos = function() {
		return iterator;
	};
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Adds an element to the back
	self.push_back = function(obj) {
		var temp = new Node();
		
		if(this.length == 0) {
			front = temp;
			current = temp;
			end = temp;
			iterator = 0;
		} else {
			end.Next = temp;
			temp.Prev = end;
			
			end = temp;
		}
		
		temp.data = obj;
		this.length++;
	};
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Adds an element to the front
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
			
			iterator++;
		}
		
		temp.data = obj;
		this.length++;
	};
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Insert an element into a given position. It will be added
	// to the end if the position is out of range.
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
						
						if(pos <= iterator) {
							iterator++;
						}
						
						break;
					}
					finder = finder.Next;
					count++;
				}
			}
		}
	};
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Removes an element at the given position.
	self.remove = function(location) {
		var obj = GetObj(location);
		
		if(obj != null) {
			if(location < iterator) {
				iterator--;
				if(iterator < 0) {
					current = null;
				}
			} else if(location == iterator) {
				if(current.Next != null) {
					current = obj.Next;
				} else if(current.Prev != null) {
					iterator--;
					current = current.Prev;
				} else {
					current = null;
					iterator = -1;
				}
			}
			
			if(this.length > 1) {
				if(location == 0) {
					front = obj.Next;
					front.Prev = null;
				} else if(location == (this.length-1)) {
					end = obj.Prev;
					end.Next = null;
				} else {
					obj.Next.Prev = obj.Prev;
					obj.Prev.Next = obj.Next;
				}
			}
			
			delete obj;
			this.length--;
		}
	};
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Removes the element at the end of the list
	self.pop_back = function() {
		var pos = this.length-1;
		this.remove(pos);
	};
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Removes the element at the front of the list
	self.pop_front = function() {
		this.remove(0);
	}
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Deletes all data
	self.Clear = function() {
		while(this.length > 0) {
			this.remove(0);
		}
	};
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Obtain the data at a given position
	self.get = function(location) {
		return GetObj(location).data;
	};
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Set the data at a given position
	self.set = function(location, value) {
		GetObj(location).data = value;
	};
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Find the first occurence of a value within the list
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
		
	};
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Build an array equivilant to the list
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
	};
	//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
	// Take in an array of data and build the list
	self.appendArray = function(array) {
		var i = 0;
		while(i < array.length) {
			this.push_back(array[i]);
			i++;
		}
	};
}
//---------------------------------------------------------------




































