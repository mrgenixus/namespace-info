var namespace = (function(ns){
	var create = function(base, nsString){

		if (base != window) base.create = function(nsString){ return create(base,nsString)}
			
		base.run = function(scope){
			return scope.apply(this,Array.prototype.slice.apply(arguments,[2]));
		}

		if (base != window) base.namespace = function(nsString,scope){

			namespace.apply(base,arguments);

		}

		var names = nsString.split('.');
		var name = names.shift();
		if (name != '') return create(base[name] = ( base[name] || {} ), names.join('.'));
		return base;
		
	}
	var namespace = function(nsString,scope){
			space = create(this, nsString);

			if (scope && scope.apply) return scope.apply(space, Array.prototype.slice.apply(arguments,[2]));
			//else: 		
			return space;
	}

	return namespace
})()