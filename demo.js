namespace('im.lyt.general.errors',function($){
	var ns = this;

	this.display_errors = true;

	var error_messages; 
	var reset_error_messages = function (){
		error_messages = [];
		jQuery('.message').remove();
	}
	ns.reset_error_messages = reset_error_messages;
	this.reset_error_messages();
	var new_message = function(message,tag,type){
		if (ns.display_errors && message && message != ''){

			$dismiss = jQuery('<div class="dismiss">x</div>')
			$message = jQuery('<p class="message">').html(message);
			$error = jQuery('<div class="message">').append($dismiss).append($message)
			if (type) $error.addClass(type);
			$error.on('dismiss',(function($error){
				return function(){
					$error.remove();
					if (typeof(tag) != 'undefined') {
						delete error_messages[tag];
					}
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
	var new_error = function(errorString,tag){

		return new_message(errorString,tag,'error');
	}
	var new_success = function(successString,tag){
		return new_message(successString,tag,'success');
	}

	forms = namespace('im.lyt.general.forms')

	forms.new_error = new_error
	forms.new_success = new_success
	forms.new_message = new_message


})


namespace('im.lyt.general.forms',function($){
	var ns = this;
	var submit_form = function(action,formId){
		reset_error_messages();
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
					$form.prepend(this.new_error($form.data('incomplete'),formId));

					var elementModel = ( rdata.model && '[' + rdata.model + ']' ) || '';

					rdata.validation && $.each(
						rdata.validation,
						function(i,v){
							$(myForm.elements['data' + elementModel + '[' + i + ']']).before(this.new_error(v,i));
						}
					);
					 
				} else {
					
					//console.log(rdata['status'])
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

	var initialized_forms = [];
	ns.initialized_forms = function(){
		return new Array(initialized_forms);
	}

	var init_form = function(i,v){
		ns.initialized_forms.push(v)
		if (v.tagName != 'FORM') return;

		var action = $(v).data('action') || v.action + '_' + {'get':'json','post':'rest'}[v.method.toLowerCase()];;
		var name = v.name;

		$(v).on('submit.submit_form',(function(action,name){
			return function(){
				submit_form(action,name);
			}
		})(action,name)).on('submit.safety',function(){ return false;});;

		v.action = ''
		//console.log(i,v,action,name)
	}
	$.fn.init_form = function(callback){
		return this.on('callback',callback).each(init_form)
		//else return this.each(init_form);
	}
	ns.init_form = function(selector,callback){

		return $(selector).init_form(callback);
	}
	$(document).ready(function(){

		$('form[data-enablejson="true"]').each(init_form)
	})

	this.submit_form = function(element){
		element = element || this;	
		return $(element).init_form().submit();
	}
	this.custom_event = function(element){
		element = element || this
		return element;
	}

},jQuery);