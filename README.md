# Namespaces in Javascipt
*with acknowledgements to David Flannigan for his contribution: 'Javascript: The definitive Guide' by O'Reilly*
## What's going on here?
this repository is basically a complex write-up on about 15 lexical features of Javascript; in my opinion, important features that everyone should be knowing

[TOC]

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
			
			var names = nsString.split('.'),name = names.shift();
			if (name != '') return create(base[name] = ( base[name] || {} ), names.join('.'));
			return base;
			
		}
		var exec = function(scope){
			return scope.apply(this,Array.prototype.slice.apply(arguments,[1]));
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
### Namespacing in Javascript

#### complications:
Namespacing in Javascript is pretty complicated.  Since every type is a member-symbol of the global or 'window' scope, by default, just adding new types can create problems if namespacing isn't carefully managed.  The common conception in Javascript is to use a style not-unlike python's modules system.  In Javascript, the definitive guide, David Flanagan recommends using an internet namespace that you own, such as mine: new-life-tech.com, as the base namespace for new obejcts used by Javascript applications.  Then, use the package name.  for-example, the javascript designed FOR this tutorial should be in the namespace: com.github.mrgenixus.namespace_info.  What this means, in-practice, is that objects must be initialized at each level of the tree.

#### Implementation

	window['com'] = window['com'] || {};

Above is the easiest, and possibly, best, way to inialize the root node.  Each subsequent namespace should be defined similarly:

	bn = window['com'] //base_namespace, renamed for convenience
	bn = (bn.github = bn.github || {}); //initize child and reset base
	bn = (bn.mrgenixus = bn.mrgenixus || {}); // wash, rinse repeat
	bn.namespace_info = bn.namespace_info || {}; //instances com.github.mrgenixus.namespace_info

#### using namespaces

Once you're using namespaces, there are some changes to the basic javascript which allow greater flexibility.  One method is to define new methods in their namespace:

	com.github.mrgenixus.namespace_info.create_namespace = function(){ /* ... */ }

another is to use the apply and call syntaxes; I'll be covering that below.


	
### Closure

	(function(){ /* ... */ })();
This is a very common idiom in javascript with several benefits and otherwise, important uses
* The code inside this function can be isolated from other code
* Variables explicity declared in this scope will NOT clutter the global scope;
specifically, closures may be considered a scope package: a closed loop for ceartain kinds of data;

### Explicit Declaration
	var ns_parent /* ... */
Javascript handles scope in a very unique way: variables created in any scope, except when prefixed with 'var' are added to the global or 'window' scope; object properties are not new variables, so they are added to an objects scope; using 'var' in the global or 'window' scope is meaningless, but may be required by some interpretters

### No Static keywork, but static variables, through closure
	(function(){ 
		var ns_parent = this;
		var anon = function(){ /* ... */ };
	})();
### this and its many meanings
	var ns_parent = this;

	var namespace = function(nsString,scope){
		ns_parent = this;
		/* ... */
	}

	var create = function(base, nsString){
		if (arguments.length == 1) {
			nsString = base; base = this;
		}
		/* ... */
	}

### lambda
	var create = function(base, nsString){ /* ... */}

### handling arbitrary arguements, multiple prototypes

	if (arguments.length == 1) {
		nsString = base; base = this;
	}

	if (scope && scope.apply) { /* ... */ }

	if (arguments.length == 1) {
		nsString = base; base = this;
	}

### arguements is not an array 
	return scope.apply(this,Array.prototype.slice.apply(arguments,[1]));

### Object Properties
	base.ns_parent = ns_parent;

### prototypes (C++ style)
	var create;

	base.ns_create = create

	create = function(){
		/* ... */
	}

### Object properties, methods, and assignable functions
	base.ns_create = create

### multiple assignment
	base.ns_apply_to = base.ns_run = exec

	var a,b = 4, c;

### Lazy object initialization with OR (||)
	base[name] = ( base[name] || {} )

### recursive lambda
	var create = function(base, nsString){
        var names = nsString.split('.');
        var name = names.shift();
        if (name != '') return create(base[name] = ( base[name] || {} ), names.join('.'));
        return base;

    }

### passing blocks or lambdas
	var namespace = function(nsString,scope){ /* ... */

### apply and call
	(function() { /* ... */ }).apply(namespace,arguements); //simplified

	(function() { /* ... */ }).call(namespace);

### global assignment
	windows[ns] = namespace

### variable variables
	window[ns] = namespace

### Anonymous self-invocation
	(function(ns){ })('namespace');

### end-of-line characters and continuations
