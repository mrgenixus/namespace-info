# Namespaces in Javascipt
*with acknowledgements to David Flannigan for his contribution: 'Javascript: The definitive Guide' by O'Reilly*
## What's going on here?
this repository is basically a complex write-up on about 15 lexical features of Javascript; in my opinion, important features that everyone should be knowing

## The Core Code:

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

		window[ns] = namespace
	})('namespace')

## Breaking it down;
I'm going to take this in secions, here we go ...
### 
	
### Closure and Anonymous self-invocation
	(function(){ /* ... */ })();
This is a very common idiom in javascript with several benefits and otherwise, important uses
* The code inside this function can be isolated from other code
* Variables explicity declared in this scope will NOT clutter the global scope;
* variables from an enclosing scope can be save in a private scope by including them in the call
specifically, closures may be considered a scope package: a closed loop for ceartain kinds of data;

### No Static keywork, but static variables, through closure
	(function(){ 
		var ns_parent = this;
		var anon = function(){ /* ... */ };
	})();
	
### lambda
	var create = function(base, nsString){ /* ... */}

### Explicit Declaration
	var namespace /* ... */
Javascript handles scope in a very unique way: variables created in any scope, except when prefixed with 'var' are added to the global or 'window' scope; object properties are not new variables, so they are added to an objects scope; using 'var' in the global or 'window' scope is meaningless, but may be required by some interpretters

