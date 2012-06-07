namespace('com.github.mrgenixus.namespace-info.errors',function($){
	
	this.display = true;

	var error_messages = (this.reset = function (){
		jQuery('.message').remove();
		return error_messages = [];
	})()

	var new_message = function(message,type){
		if (this.display && message && message != ''){

			$dismiss = jQuery('<div class="dismiss">&times;</div>')
			$message = jQuery('<p class="message">').html(message);
			$error = jQuery('<div class="message">').append($dismiss).append($message)
			if (type) $error.addClass(type);
			$error.on('dismiss',(function($error){
				return function(){
					$error.remove();
				};
			})($error))
			$dismiss.click(
				(function($error){
					return function(){
						$error.trigger('dismiss');
					};
				})($error));
			if (typeof(tag) != 'undefined') {
				error_messages.push($error);
			}
			return $error
		}
	}
	var new_error = function(errorString){
		return new_message(errorString,'error');
	}
	var new_success = function(successString){
		return new_message(successString,'success');
	}

	this.success = new_success; this.error = new_error; this.new = new_message;

})


namespace('com.github.mrgenixus.namespace-info.forms',function($){

	var error = this.ns_parent.namespace('errors');

	var submit_form = function(action,formId){
		error.reset();

		var $form  = jQuery("#" + formId + ", form[name='" + formId + "']");
		var myForm = $form[0];

		var method = $form.attr('method');
		
		
		//console.log(action,method)
		jQuery.ajax(action,{type:method,
			data:$form.serialize(), 
			success:function(rdata){
				
				$form.prepend(this.new_success(rdata['status'],formId));
				if(rdata['code'] != 200){

					//if undefined, this displays nothing
					$form.prepend(error.error($form.data('incomplete'),formId));

					var elementModel = ( rdata.model && '[' + rdata.model + ']' ) || '';

					rdata.validation && $.each(
						rdata.validation,
						function(i,v){
							$(myForm.elements['data' + elementModel + '[' + i + ']']).before(error.error(v));
						}
					);
				} else {
					var redirectUrl = "/";
					if(typeof(rdata['redirect-to']) != 'undefined') redirectUrl = rdata['redirect-to'];
					
					if (! window.stop_redirect && typeof(redirect_root) != 'undefined') {
						redirectUrl = (redirect_root || '.') + redirectUrl;
						document.location.href = redirectUrl;
					}

					$form.trigger('callback')
				}
			}
		});
	}

	/*private:*/ var initialized_forms = [];

	/*public:*/ this.initialized_forms = function(){
		return initialized_forms.slice();
	}

	var init_form = function(i,v){

		initialized_forms.push(v)

		if (v.tagName != 'FORM') return;

		var action = $(v).data('action') || v.action + '_' + {'get':'json','post':'rest'}[v.method.toLowerCase()];;

		//wrapping up acion, name in closure
		var submit = (function(action,name){
			return function(){
				submit_form(action,name);
			}
		})(action,v.name);

		$(v).off('submit.safety').off('submit.submit_form') //make sure that we don't stop this from firing if we already bind, or someting;
			.on('submit.submit_form',submit)
			.on('submit.safety',function(){ return false; });

		v.action = ''
		//console.log(i,v,action,name)
	}

	//jQuery initialization:
	$.fn.init_form = function(callback){
		return this.on('callback',callback).each(init_form)
	}
	$(document).on('ready','form[data-enablejson="true"]',init_form);

	//namespace, jQuery dependent methods

	this.init_form = function(selector,callback){
		return $(selector).init_form(callback);
	}
	this.submit_form = function(element){
		element = element || this;	
		return $(element).init_form().submit();
	}
	this.custom_event = function(element){
		element = element || this
		return element;
	}


},jQuery);