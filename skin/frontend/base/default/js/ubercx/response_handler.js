/*
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the GNU General Public License
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/gpl-license
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@refersion.com so we can send you a copy immediately.
 *
 * @category   UBERCX
 * @package    Ubercx_Addressvalidator
 * @copyright  Copyright (c) 2015 Ubercx, Inc.
 * @author	   Ubercx Developer <ubercx_nospam@jframeworks.com>
 * @license    http://opensource.org/licenses/gpl-license GNU General Public License
 */
if (window.shipping){
	//replace the nextStep method in the Billing prototype
	var replaceBillingNextStepObj = {
		nextStep: function (transport) {
			if (transport && transport.responseText) {
	    	try {
					response = eval('(' + transport.responseText + ')');
	      }
	      catch (e) {
	      	response = {};
	      }
	    }
			if (response && response.validate) {}
	    	if (!response.error) {
					
	      } else {
					var selected_address_id = '';
	      	//clear out any previous data in our error area
					$('ubercx_addr_radio').innerHTML = '';
					//first the original
					//radio button
					addr = ((response.data.orig.addr1 =="") ? "" : response.data.orig.addr1 + ", ");
					addr += ((response.data.orig.addr2 =="") ? "" : response.data.orig.addr2 + ", ");	
					addr += ((response.data.orig.city =="") ? "" : response.data.orig.city + ", ");
					addr += ((response.data.orig.state =="") ? "" : response.data.orig.state + ", ");
					addr += ((response.data.orig.zip =="") ? "" : response.data.orig.zip);
					
					if(typeof(response.address_id)!== 'undefined' && response.address_id!=""){
						selected_address_id = "<input type='hidden' name='selected_address_id' id='selected_address_id' value='"+response.address_id+"'>";
					}
					else{
						selected_address_id = "<input type='hidden' name='selected_address_id' id='selected_address_id' value=''>";
					}
									
					$('ubercx_addr_radio').innerHTML = $('ubercx_addr_radio').innerHTML+'<div class="ubercx-addr-radio"><input type="radio" name="ubercx_which_to_use" id="ubercx_radio_orig" onclick="ubercx_radio_changed(this);" value="orig" checked><label for="ubercx_radio_orig"><b> Use Original: </b>' + addr + '</label></div>';
									
					//The hidden fields that get posted back to our plugin
					$('ubercx_addr_radio').innerHTML = $('ubercx_addr_radio').innerHTML+"<div style='display: hidden;'><input type='hidden' name='ubercx_addr_orig_addr1' id='ubercx_addr_orig_addr1' value='" + response.data.orig.addr1 + "'><input type='hidden' name='ubercx_addr_orig_addr2' id='ubercx_addr_orig_addr2' value='" + response.data.orig.addr2 + "'><input type='hidden' name='ubercx_addr_orig_city' id='ubercx_addr_orig_city' value='"  + response.data.orig.city + "'><input type='hidden' name='ubercx_addr_orig_state' id='ubercx_addr_orig_state' value='" + response.data.orig.state + "'><input type='hidden' name='ubercx_addr_orig_region_id' id='ubercx_addr_orig_region_id' value='" + response.data.orig.region_id + "'><input type='hidden' name='ubercx_addr_orig_zip' id='ubercx_addr_orig_zip' value='" + response.data.orig.zip + "'>"+selected_address_id+"</div>";
					
					//do we have any corrected addresses?
					if( typeof(response.data.corrected) !== 'undefined' && response.data.corrected.length > 0){
						for (var i = 0; i < response.data.corrected.length; i++) {
											
							addr = ((response.data.corrected[i].addr1 =="") ? "" : response.data.corrected[i].addr1 + ", ");
							addr += ((response.data.corrected[i].addr2 =="") ? "" : response.data.corrected[i].addr2 + ", ");	
							addr += ((response.data.corrected[i].city =="") ? "" : response.data.corrected[i].city + ", ");
							addr += ((response.data.corrected[i].state =="") ? "" : response.data.corrected[i].state + ", ");
							addr += ((response.data.corrected[i].zip =="") ? "" : response.data.corrected[i].zip);
								
							$('ubercx_addr_radio').innerHTML = $('ubercx_addr_radio').innerHTML+'<div class="ubercx-addr-radio"><input type="radio" name="ubercx_which_to_use" id="ubercx_radio_' + i + '" value="' + i + '" onclick="ubercx_radio_changed(this);"><label for="ubercx_radio_' + i + '"><b> Suggestion: </b>' + addr + '</label></div>';
					
							//The hidden fields that get posted back to our plugin
											
							$('ubercx_addr_radio').innerHTML = $('ubercx_addr_radio').innerHTML+"<div style='display: hidden;'><input type='hidden' name='ubercx_addr_corrected_" + i + "_addr1' id='ubercx_addr_corrected_" + i + "_addr1' value='" + response.data.corrected[i].addr1 + "'><input type='hidden' name='ubercx_addr_corrected_" + i + "_addr2' id='ubercx_addr_corrected_" + i + "_addr2' value='" + response.data.corrected[i].addr2 + "'><input type='hidden' name='ubercx_addr_corrected_" + i + "_city' id='ubercx_addr_corrected_" + i + "_city' value='"  + response.data.corrected[i].city + "'><input type='hidden' name='ubercx_addr_corrected_" + i + "_state' id='ubercx_addr_corrected_" + i + "_state' value='" + response.data.corrected[i].state + "'><input type='hidden' name='ubercx_addr_corrected_" + i + "_region_id' id='ubercx_addr_corrected_" + i + "_region_id' value='" + response.data.corrected[i].region_id + "'><input type='hidden' name='ubercx_addr_corrected_" + i + "_zip' id='ubercx_addr_corrected_" + i + "_zip' value='" + response.data.corrected[i].zip + "'></div>";
						}
					}
					$('ubercx_addr_radio').innerHTML = $('ubercx_addr_radio').innerHTML+'<div style="text-align:right"><a href="javascript:clear_validations(\'\')">Clear Results</a></div>';
					//un-hide the display
					$('ubercx_addr_correction').show();
					$('ubercx_addr_correction').scrollTo();
	      }
	    
				checkout.setStepResponse(response);
	 	}
	};
	Billing.addMethods(replaceBillingNextStepObj);

	
	//replace the nextStep method in the Shipping prototype
	var replaceShippingNextStepObj = {
		nextStep: function (transport) {
	  	if (transport && transport.responseText) {
	    	try {
	      	response = eval('(' + transport.responseText + ')');
	      }
	      catch (e) {
	      	response = {};
	      }
	    }
			if (response && response.validate) {}
			
	    	if (!response.error) {
					
        	/*if (typeof response.data == 'string') {
	        	addressValidator.validateAddress('co-shipping-form', response.message, response.data);
	        }*/
	      } else {
					var selected_address_id = '';
	      	//clear out any previous data in our error area
					$('ubercx_ship_addr_radio').innerHTML = '';
					//first the original
					//radio button
					addr = ((response.data.orig.addr1 =="") ? "" : response.data.orig.addr1 + ", ");
					addr += ((response.data.orig.addr2 =="") ? "" : response.data.orig.addr2 + ", ");	
					addr += ((response.data.orig.city =="") ? "" : response.data.orig.city + ", ");
					addr += ((response.data.orig.state =="") ? "" : response.data.orig.state + ", ");
					addr += ((response.data.orig.zip =="") ? "" : response.data.orig.zip);
					
					if(typeof(response.address_id)!== 'undefined' && response.address_id!=""  && response.address_id!=null){
						selected_address_id = "<input type='hidden' name='selected_address_id' id='selected_address_id' value='"+response.address_id+"'>";
					}
					else{
						selected_address_id = "<input type='hidden' name='selected_address_id' id='selected_address_id' value=''>";
					}
									
					$('ubercx_ship_addr_radio').innerHTML = $('ubercx_ship_addr_radio').innerHTML+'<div class="ubercx-addr-radio"><input type="radio" name="ubercx_which_to_use" id="ubercx_ship_radio_orig" onclick="ubercx_radio_ship_changed(this);" value="orig" checked><label for="ubercx_ship_radio_orig"><b> Use Original: </b>' + addr + '</label></div>';
									
					//The hidden fields that get posted back to our plugin
					$('ubercx_ship_addr_radio').innerHTML = $('ubercx_ship_addr_radio').innerHTML+"<div style='display: hidden;'><input type='hidden' name='ubercx_ship_addr_orig_addr1' id='ubercx_ship_addr_orig_addr1' value='" + response.data.orig.addr1 + "'><input type='hidden' name='ubercx_ship_addr_orig_addr2' id='ubercx_ship_addr_orig_addr2' value='" + response.data.orig.addr2 + "'><input type='hidden' name='ubercx_ship_addr_orig_city' id='ubercx_ship_addr_orig_city' value='"  + response.data.orig.city + "'><input type='hidden' name='ubercx_ship_addr_orig_state' id='ubercx_ship_addr_orig_state' value='" + response.data.orig.state + "'><input type='hidden' name='ubercx_ship_addr_orig_region_id' id='ubercx_ship_addr_orig_region_id' value='" + response.data.orig.region_id + "'><input type='hidden' name='ubercx_ship_addr_orig_zip' id='ubercx_ship_addr_orig_zip' value='" + response.data.orig.zip + "'>"+selected_address_id+"</div>";
								
					//do we have any corrected addresses?
					if( typeof(response.data.corrected) !== 'undefined' && response.data.corrected.length > 0){
						for (var i = 0; i < response.data.corrected.length; i++) {
											
							addr = ((response.data.corrected[i].addr1 =="") ? "" : response.data.corrected[i].addr1 + ", ");
							addr += ((response.data.corrected[i].addr2 =="") ? "" : response.data.corrected[i].addr2 + ", ");	
							addr += ((response.data.corrected[i].city =="") ? "" : response.data.corrected[i].city + ", ");
							addr += ((response.data.corrected[i].state =="") ? "" : response.data.corrected[i].state + ", ");
							addr += ((response.data.corrected[i].zip =="") ? "" : response.data.corrected[i].zip);
								
							$('ubercx_ship_addr_radio').innerHTML = $('ubercx_ship_addr_radio').innerHTML+'<div class="ubercx-addr-radio"><input type="radio" name="ubercx_which_to_use" id="ubercx_ship_radio_' + i + '" value="' + i + '" onclick="ubercx_radio_ship_changed(this);"><label for="ubercx_ship_radio_' + i + '"><b> Suggestion: </b>' + addr + '</label></div>';
					
							//The hidden fields that get posted back to our plugin
											
							$('ubercx_ship_addr_radio').innerHTML = $('ubercx_ship_addr_radio').innerHTML+"<div style='display: hidden;'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_addr1' id='ubercx_ship_addr_corrected_" + i + "_addr1' value='" + response.data.corrected[i].addr1 + "'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_addr2' id='ubercx_ship_addr_corrected_" + i + "_addr2' value='" + response.data.corrected[i].addr2 + "'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_city' id='ubercx_ship_addr_corrected_" + i + "_city' value='"  + response.data.corrected[i].city + "'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_state' id='ubercx_ship_addr_corrected_" + i + "_state' value='" + response.data.corrected[i].state + "'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_region_id' id='ubercx_ship_addr_corrected_" + i + "_region_id' value='" + response.data.corrected[i].region_id + "'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_zip' id='ubercx_ship_addr_corrected_" + i + "_zip' value='" + response.data.corrected[i].zip + "'></div>";
						}
					}
					$('ubercx_ship_addr_radio').innerHTML = $('ubercx_ship_addr_radio').innerHTML+'<div style="text-align:right"><a href="javascript:clear_validations(\'_ship\')">Clear Results</a></div>';
					//un-hide the display
					$('ubercx_ship_addr_correction').show();
					$('ubercx_ship_addr_correction').scrollTo();
	      }
	    
			checkout.setStepResponse(response);
			
	 	}
	};
	Shipping.addMethods(replaceShippingNextStepObj);	
}
if(non_ajax_response==''){
	Ajax.Responders.register({
		
		onComplete: function(response){
			if($('opc-shipping_method').hasClassName('active') || $('opc-payment').hasClassName('active') || $('opc-review').hasClassName('active')){
				clear_validations('');
				clear_validations('_ship');
			}
		}
	});
}
if(non_ajax_response!=''){

	if (!non_ajax_response.error) {
		/*if (typeof response.data == 'string') {
			addressValidator.validateAddress('co-shipping-form', response.message, response.data);
		}*/
	} else {
		//clear out any previous data in our error area
		$('ubercx_ship_addr_radio').innerHTML = '';
		//first the original
		//radio button
		addr = ((non_ajax_response.data.orig.addr1 =="") ? "" : non_ajax_response.data.orig.addr1 + ", ");
		addr += ((non_ajax_response.data.orig.addr2 =="") ? "" : non_ajax_response.data.orig.addr2 + ", ");	
		addr += ((non_ajax_response.data.orig.city =="") ? "" : non_ajax_response.data.orig.city + ", ");
		addr += ((non_ajax_response.data.orig.state =="") ? "" : non_ajax_response.data.orig.state + ", ");
		addr += ((non_ajax_response.data.orig.zip =="") ? "" : non_ajax_response.data.orig.zip);
						
		$('ubercx_ship_addr_radio').innerHTML = $('ubercx_ship_addr_radio').innerHTML+'<div class="ubercx-addr-radio"><input type="radio" name="ubercx_which_to_use" id="ubercx_ship_radio_orig" onclick="ubercx_radio_ship_no_ajax_changed(this);" value="orig" checked><label for="ubercx_ship_radio_orig"><b> Use Original: </b>' + addr + '</label></div>';
						
		//The hidden fields that get posted back to our plugin
		$('ubercx_ship_addr_radio').innerHTML = $('ubercx_ship_addr_radio').innerHTML+"<div style='display: hidden;'><input type='hidden' name='ubercx_ship_addr_orig_addr1' id='ubercx_ship_addr_orig_addr1' value='" + non_ajax_response.data.orig.addr1 + "'><input type='hidden' name='ubercx_ship_addr_orig_addr2' id='ubercx_ship_addr_orig_addr2' value='" + non_ajax_response.data.orig.addr2 + "'><input type='hidden' name='ubercx_ship_addr_orig_city' id='ubercx_ship_addr_orig_city' value='"  + non_ajax_response.data.orig.city + "'><input type='hidden' name='ubercx_ship_addr_orig_state' id='ubercx_ship_addr_orig_state' value='" + non_ajax_response.data.orig.state + "'><input type='hidden' name='ubercx_ship_addr_orig_region_id' id='ubercx_ship_addr_orig_region_id' value='" + non_ajax_response.data.orig.region_id + "'><input type='hidden' name='ubercx_ship_addr_orig_zip' id='ubercx_ship_addr_orig_zip' value='" + non_ajax_response.data.orig.zip + "'></div>";
					
		//do we have any corrected addresses?
		if( typeof(non_ajax_response.data.corrected) !== 'undefined' && non_ajax_response.data.corrected.length > 0){
			for (var i = 0; i < non_ajax_response.data.corrected.length; i++) {
								
				addr = ((non_ajax_response.data.corrected[i].addr1 =="") ? "" : non_ajax_response.data.corrected[i].addr1 + ", ");
				addr += ((non_ajax_response.data.corrected[i].addr2 =="") ? "" : non_ajax_response.data.corrected[i].addr2 + ", ");	
				addr += ((non_ajax_response.data.corrected[i].city =="") ? "" : non_ajax_response.data.corrected[i].city + ", ");
				addr += ((non_ajax_response.data.corrected[i].state =="") ? "" : non_ajax_response.data.corrected[i].state + ", ");
				addr += ((non_ajax_response.data.corrected[i].zip =="") ? "" : non_ajax_response.data.corrected[i].zip);
					
				$('ubercx_ship_addr_radio').innerHTML = $('ubercx_ship_addr_radio').innerHTML+'<div class="ubercx-addr-radio"><input type="radio" name="ubercx_which_to_use" id="ubercx_ship_radio_' + i + '" value="' + i + '" onclick="ubercx_radio_ship_no_ajax_changed(this);"><label for="ubercx_ship_radio_' + i + '"><b> Suggestion: </b>' + addr + '</label></div>';
		
				//The hidden fields that get posted back to our plugin
								
				$('ubercx_ship_addr_radio').innerHTML = $('ubercx_ship_addr_radio').innerHTML+"<div style='display: hidden;'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_addr1' id='ubercx_ship_addr_corrected_" + i + "_addr1' value='" + non_ajax_response.data.corrected[i].addr1 + "'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_addr2' id='ubercx_ship_addr_corrected_" + i + "_addr2' value='" + non_ajax_response.data.corrected[i].addr2 + "'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_city' id='ubercx_ship_addr_corrected_" + i + "_city' value='"  + non_ajax_response.data.corrected[i].city + "'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_state' id='ubercx_ship_addr_corrected_" + i + "_state' value='" + non_ajax_response.data.corrected[i].state + "'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_region_id' id='ubercx_ship_addr_corrected_" + i + "_region_id' value='" + non_ajax_response.data.corrected[i].region_id + "'><input type='hidden' name='ubercx_ship_addr_corrected_" + i + "_zip' id='ubercx_ship_addr_corrected_" + i + "_zip' value='" + non_ajax_response.data.corrected[i].zip + "'></div>";
			}
		}
		$('ubercx_ship_addr_radio').innerHTML = $('ubercx_ship_addr_radio').innerHTML+'<div style="text-align:right"><a href="javascript:clear_validations(\'_ship\')">Clear Results</a></div>';
		//un-hide the display
		$('ubercx_ship_addr_correction').show();
		$('ubercx_ship_addr_correction').scrollTo();
	}
}
//Handle the radio button change
function ubercx_radio_changed(item){
	//TODO we need to work out how to select the correct state here....
	//lets copy the data into the appropriate fields
	if(item.value=='orig'){
		//go with orig values
		addr1 = $('ubercx_addr_orig_addr1').value;
		addr2 = $('ubercx_addr_orig_addr2').value;
		city	= $('ubercx_addr_orig_city').value;
		state = $('ubercx_addr_orig_region_id').value;
		zip   = $('ubercx_addr_orig_zip').value;
		
	} else {
		//it is one of the corrected fields
		key = item.value;
		addr1 = $('ubercx_addr_corrected_' + key + '_addr1').value;
		addr2 = $('ubercx_addr_corrected_' + key + '_addr2').value;
		city  = $('ubercx_addr_corrected_' + key + '_city').value;
		state = $('ubercx_addr_corrected_' + key + '_region_id').value;
		zip   = $('ubercx_addr_corrected_' + key + '_zip').value;
	}

	//OK are we shipping to different addr?

	//shipping to billing
	$('billing:street1').value =addr1;
	$('billing:street2').value =addr2;
	$('billing:city').value =city;
	$('billing:region_id').value =state;
	$('billing:postcode').value =zip;

	//always update the ship to in case they select it!
	if($('billing:use_for_shipping_yes').checked ){
		$('shipping:street1').value =addr1;
		$('shipping:street2').value =addr2;
		$('shipping:city').value =city;
		$('shipping:region_id').value =state;
		$('shipping:postcode').value =zip;
	}
	if(!$('billing-new-address-form').visible() && item.value!="orig"){
		$('billing-address-select').value = "";
		$('billing-new-address-form').show();
		
	}
	else if($('billing-new-address-form').visible() && item.value!="orig"){}
	else{
		$('billing-address-select').value = $('selected_address_id').value;
		if($('selected_address_id').value!=""){
			$('billing-new-address-form').hide();
		}
	}
}

//Handle the radio button change
function ubercx_radio_ship_changed(item){
	//TODO we need to work out how to select the correct state here....
	//lets copy the data into the appropriate fields
	if(item.value=='orig'){
		//go with orig values
		addr1 = $('ubercx_ship_addr_orig_addr1').value;
		addr2 = $('ubercx_ship_addr_orig_addr2').value;
		city	= $('ubercx_ship_addr_orig_city').value;
		state = $('ubercx_ship_addr_orig_region_id').value;
		zip   = $('ubercx_ship_addr_orig_zip').value;
		
	} else {
		//it is one of the corrected fields
		key = item.value;
		addr1 = $('ubercx_ship_addr_corrected_' + key + '_addr1').value;
		addr2 = $('ubercx_ship_addr_corrected_' + key + '_addr2').value;
		city  = $('ubercx_ship_addr_corrected_' + key + '_city').value;
		state = $('ubercx_ship_addr_corrected_' + key + '_region_id').value;
		zip   = $('ubercx_ship_addr_corrected_' + key + '_zip').value;
	}

	//OK are we shipping to different addr?
	if($('billing:use_for_shipping_no').checked ){
		//shipping to different addr
		$('shipping:street1').value = addr1;
		$('shipping:street2').value =addr2;
		$('shipping:city').value =city;
		$('shipping:region_id').value =state;
		$('shipping:postcode').value =zip;
	}
	if(!$('shipping-new-address-form').visible() && item.value!="orig"){
		$('shipping-address-select').value = "";
		$('shipping-new-address-form').show();
	}
	else if($('shipping-new-address-form').visible() && item.value!="orig"){}
	else{
		$('shipping-address-select').value = $('selected_address_id').value;
		if($('selected_address_id').value!=""){
			$('shipping-new-address-form').hide();
		}
	}
}
//Handle the radio button change
function ubercx_radio_ship_no_ajax_changed(item){
	//TODO we need to work out how to select the correct state here....
	//lets copy the data into the appropriate fields
	if(item.value=='orig'){
		//go with orig values
		addr1 = $('ubercx_ship_addr_orig_addr1').value;
		addr2 = $('ubercx_ship_addr_orig_addr2').value;
		city	= $('ubercx_ship_addr_orig_city').value;
		state = $('ubercx_ship_addr_orig_region_id').value;
		zip   = $('ubercx_ship_addr_orig_zip').value;
		
	} else {
		//it is one of the corrected fields
		key = item.value;
		addr1 = $('ubercx_ship_addr_corrected_' + key + '_addr1').value;
		addr2 = $('ubercx_ship_addr_corrected_' + key + '_addr2').value;
		city  = $('ubercx_ship_addr_corrected_' + key + '_city').value;
		state = $('ubercx_ship_addr_corrected_' + key + '_region_id').value;
		zip   = $('ubercx_ship_addr_corrected_' + key + '_zip').value;
	}

	//OK are we shipping to different addr?

		//shipping to different addr
		$('street_1').value = addr1;
		$('street_2').value =addr2;
		$('city').value =city;
		$('region_id').value =state;
		$('zip').value =zip;

}
function clear_validations(divId){
	$('ubercx'+divId+'_addr_radio').innerHTML = '';
	$('ubercx'+divId+'_addr_correction').hide();
}