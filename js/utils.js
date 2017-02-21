// Returns true if a value is between a and b
function between(value, a, b) {
	return (value >= a) && (value <= b);
}
// Returns the type of an object/variable
function typeOf (obj) {
  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}