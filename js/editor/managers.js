var Origins = (function() {
    function Origins() {
        this.origin_x = 0;
		this.origin_y = 0;
    }
    var instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new Origins();
                instance.constructor = null;
            }
            return instance;
        }
   };
})();
