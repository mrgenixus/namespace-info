(function(ns){

	var ns_parent = this;
	var create = function(base, nsString){
		if (arguments.length == 1) {
			nsString = base; base = this;
		}

		base.ns_parent = ns_parent; ns_parent = base;
		if (base != window && ! base.ns_create) base.ns_create = create
		base.ns_apply_to = base.ns_run = exec
		if (base != window && ! base.namespace) base.namespace = namespace;

		var names = nsString.split('.');
		var name = names.shift();
		if (name != '') return create(base[name] = ( base[name] || {} ), names.join('.'));
		return base;
		
	}
	var exec = function(scope){
		return scope.apply(this,arguments);
	}
	var namespace = function(nsString,scope){
			ns_parent = this;
			space = create(this, nsString);
			if (scope && scope.apply) return scope.apply(space, Array.prototype.slice.apply(arguments,[2]));
			//else: 		
			return space;
	}

	window[ns]= namespace;
})('namespace')