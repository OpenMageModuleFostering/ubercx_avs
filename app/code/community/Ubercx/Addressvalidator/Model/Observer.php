<?php

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
 
class Ubercx_Addressvalidator_Model_Observer extends Mage_Core_Model_Abstract {
	const UBERCX_ADDR_DOMAIN = 'ubercx-addr-val';
	/**
	 * Validate address using Ubercx API, rewrite response if suggestions available
	 * 
	 * @param Varien_Event_Observer $observer
	 * @return Varien_Event_Observer $observer
	 */
	public function validateAddress($observer) {
  	$helper = Mage::helper('addressvalidator');
		$request = Mage::app()->getRequest();
		$event = $observer->getEvent();
		$controller = $event->getControllerAction();
		$ob_response = $controller->getResponse();
		$store = Mage::app()->getStore();
		$storeId = $store->getId();
		$quote = Mage::getSingleton('checkout/session')->getQuote();
		$address_type = '';
		//check if module is actiave to use
		if(!$helper->isEnable()){
			return $observer;
		}
		
		if ($event->getName() == 'controller_action_postdispatch_checkout_onepage_saveBilling') {
			$address = $quote->getBillingAddress();
		} else {
			$address = $quote->getShippingAddress();
		}
		
		if ($address->getAddressType()=='billing'){
			$billing = $request->getParam('billing');
      if (!$billing['use_for_shipping']){
      	return $observer;
      }
    }
		
		//ok if we have a 'which_to_use' it means the user has selected one - which means we validated already
		//Lets see if they have changed any data, if they have we need to revalidate!!!
		if(isset($_POST['ubercx_which_to_use'])){
			
			//ok lets see if any of the fields are dirty
			//which one did they select
			$selected = $_POST['ubercx_which_to_use'];
			
			// create the hidden id used in the html so we can check if it is dirty
			if($selected != 'orig'){
				$selected = "corrected_" . $selected;
			} 
			
			if ($address->getAddressType()=='billing'){
				//collect the fields from the hidden fields in post
				$post_addr1 = $_POST['ubercx_addr_' . $selected . '_addr1'];
				$post_addr2 = $_POST['ubercx_addr_' . $selected . '_addr2'];
				$post_city 	= $_POST['ubercx_addr_' . $selected . '_city'];
				$post_state = $_POST['ubercx_addr_' . $selected . '_state'];
				$post_zip 	= $_POST['ubercx_addr_' . $selected . '_zip'];
    	}
			else{
				//collect the fields from the hidden fields in post
				$post_addr1 = $_POST['ubercx_ship_addr_' . $selected . '_addr1'];
				$post_addr2 = $_POST['ubercx_ship_addr_' . $selected . '_addr2'];
				$post_city 	= $_POST['ubercx_ship_addr_' . $selected . '_city'];
				$post_state = $_POST['ubercx_ship_addr_' . $selected . '_state'];
				$post_zip 	= $_POST['ubercx_ship_addr_' . $selected . '_zip'];
			}
			
			

			//Now compare them to the form to see if it is dirty
			//Billing or shipping addr?
			$dirty = false;
			
			($address->getStreet(1) == $post_addr1) ? $dirty=$dirty : $dirty=true;
			($address->getStreet(2) == $post_addr2) ? $dirty=$dirty : $dirty=true;
			($address->getCity() == $post_city) ? $dirty=$dirty : $dirty=true;
			if($selected != 'orig'){
				$region = Mage::getModel('directory/region')->loadByCode($post_state, 'US');
				$post_state = $region->getName();
			}
			($address->getRegion() == $post_state) ? $dirty=$dirty : $dirty=true;
			($address->getPostcode() == $post_zip) ? $dirty=$dirty : $dirty=true;
			($address->getCountry() == 'US') ? $dirty=$dirty : $dirty=true;		
			
			//echo $address->getStreet(1) .'=='. $post_addr1.'<br>'.$address->getStreet(2) .'=='. $post_addr2.'<br>'.$address->getCity() .'=='. $post_city.'<br>'.$address->getRegion() .'=='. $post_state.'<br>'.$address->getPostcode() .'=='. $post_zip.'<br>'.$address->getCountry() .'== US';exit;;
			//if clean then lets just return the data and we are good to go
			if(!$dirty){
				//TODO for now we return nothing so the order doesnt process
				//faking error on clean!
				return $observer;
			} 
		}
		
		//so either it is dirty or it is the first time thru - either way validate the address!
		//now check if the user opted to use the corrected addr
		
		//get the user key
		$user_key = Mage::getStoreConfig('addressvalidator/addressvalidator_settings/addressvalidator_user_key');;
		
		$first_name = $address->getFirstname();
		$last_name  = $address->getLastname();
		$address_1  = $address->getStreet(1);
		$address_2  = $address->getStreet(2);
		$city 			= $address->getCity();
		$state	 		= $address->getRegion();
		$zip 				= $address->getPostcode();
		$country 		= $address->getCountry();
		
		//ok now lets call our API
		$api_url  =  Mage::getStoreConfig('addressvalidator/ubercx_api_url');
		
		$requestId = 'Magento_' . time();
		
		$url = $api_url.'?request_id='.$requestId.'&street='.urlencode($address_1).'&secondary='.urlencode($address_2).'&state='.urlencode($state).'&city='.urlencode($city).'&zipcode='.urlencode($zip);
		
		// Start cURL
		$curl = curl_init();
		// Headers
		$headers = array();
		$headers[] = 'user_key:'.$user_key;
		//$headers[] = 'Accept: application/json';
		curl_setopt( $curl, CURLOPT_URL, $url );
		curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $curl, CURLOPT_FOLLOWLOCATION, true );
		curl_setopt( $curl, CURLOPT_HTTPHEADER, $headers );
		curl_setopt( $curl, CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt( $curl, CURLOPT_HEADER, false);
	
		// Get response
		$response = curl_exec($curl);
	
		// Get HTTP status code
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		//TODO put status check for "200". 
		// Close cURL
		curl_close($curl);
		
		// Return response from server
		if($response!=''){
			$response = json_decode($response);	
		} else {
			return $observer;
		}
		
		$transient 											= array();
		$transient['orig'] 							= array();
		$transient['orig']['addr1'] 		= $address->getStreet(1);
		$transient['orig']['addr2'] 		= $address->getStreet(2);
		$transient['orig']['city'] 			= $address->getCity();
		$transient['orig']['state'] 		= $address->getRegion();
		$transient['orig']['region_id'] = $address->getRegionId();
		$transient['orig']['zip'] 			= $address->getPostcode();
		
		if(is_object($response) && isset( $response->header) && isset( $response->header->status) && $response->header->status == 'SUCCESS'){
			if(isset($response->addressRecord[0]) && isset($response->addressRecord[0]->addressSummary) && isset($response->addressRecord[0]->addressSummary->matchCode)){
				switch($response->addressRecord[0]->addressSummary->matchCode){
					case 'AVS_01':
						if(  $response->addressRecord[0]->address[0]->zipCode != $zip){
							//Mage::getSingleton('core/session')->addError('There is a problem with your zip code, please check');
							//loop thru the matching addrs
							$transient['corrected'] = array();
								
							for($i=0; $i<count($response->addressRecord[0]->address); $i++){
							
								//save on typing store in temp!!!!
								$temp = $response->addressRecord[0]->address[$i];
								$region = Mage::getModel('directory/region')->loadByCode($temp->state, 'US');
								$state_id = $region->getId();
								$transient['corrected'][$i]['addr1'] =  is_null($temp->addressLine1) ? "" : $temp->addressLine1 ;
								$transient['corrected'][$i]['addr2'] = is_null($temp->addressLine2) ? "" : $temp->addressLine2 ;
								$transient['corrected'][$i]['city'] = is_null($temp->city) ? "" : $temp->city ;
								$transient['corrected'][$i]['state'] = is_null($temp->state) ? "" : $temp->state;
								$transient['corrected'][$i]['region_id'] = is_null($state_id) ? "" : $state_id;
								$transient['corrected'][$i]['zip'] = is_null($temp->zipCode) ? "" : $temp->zipCode;
							}
							$result['validate'] = true;
							$result['error'] = true;
							break;	
						}
					break;
					case 'AVS_02':
						//OK we should get a bunch of returned addr's - lets
						//add them to the transient
						//Mage::getSingleton('core/session')->addError('There appears to be an error in your address');	
						
						//loop thru the matching addrs
						$transient['corrected'] = array();
						
						for($i=0; $i<count($response->addressRecord[0]->address); $i++){
							
							//save on typing store in temp!!!!
							$temp = $response->addressRecord[0]->address[$i];
							$region = Mage::getModel('directory/region')->loadByCode($temp->state, 'US');
							$state_id = $region->getId();
							$transient['corrected'][$i]['addr1'] =  is_null($temp->addressLine1) ? "" : $temp->addressLine1 ;
							$transient['corrected'][$i]['addr2'] = is_null($temp->addressLine2) ? "" : $temp->addressLine2 ;
							$transient['corrected'][$i]['city'] = is_null($temp->city) ? "" : $temp->city ;
							$transient['corrected'][$i]['state'] = is_null($temp->state) ? "" : $temp->state;
							$transient['corrected'][$i]['region_id'] = is_null($state_id) ? "" : $state_id;
							$transient['corrected'][$i]['zip'] = is_null($temp->zipCode) ? "" : $temp->zipCode;
						}
						$result['validate'] = true;
						$result['error'] = true;
					break;
					case 'AVS_03':
						//we just show the original
						//but it is invalid!!!! Need to make sure the user corrects it
						//Mage::getSingleton('core/session')->addError('There is a problem with your address - please check below');
						$result['validate'] = true;
						$result['error'] = true;
					break;
					default:
						$result['validate'] = false;
            $result['error'] = false;
				}
				$result['data'] = $transient;
        $result['message'] = $response->addressRecord[0]->addressSummary->message;
				
				$ob_response->setBody(Mage::helper('core')->jsonEncode($result));
				$observer->setResult($result);
				return $observer;
				
			}
			else{
				return $observer;
			}
		}
		else{
			return $observer;
		}
	}
}