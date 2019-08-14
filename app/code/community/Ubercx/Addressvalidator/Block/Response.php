<?php
/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * @category    Phoenix
 * @package     Phoenix_Moneybookers
 * @copyright   Copyright (c) 2014 Phoenix Medien GmbH & Co. KG (http://www.phoenix-medien.de)
 * @license     http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
class Ubercx_Addressvalidator_Block_Response extends Mage_Core_Block_Template
{

	/**
	 * construct
	 * 
	 * @param 
	 * @return
	 */
	public function __construct(){
		parent::__construct();
	}
	
	/**
	 * Set result to the block
	 * 
	 * @param 
	 * @return string,array
	 */
	public function getResult(){
		if(Mage::getSingleton("core/session")->getUbercxResult()){
			$result = Mage::getSingleton("core/session")->getUbercxResult();
			//Mage::getSingleton("core/session")->unsUbercxResult()	;
			return $result;
		}
	}
}
