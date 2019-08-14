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
class Ubercx_Addressvalidator_Helper_Data extends Mage_Core_Helper_Abstract {
	/**
	 * Check if module is set enabled
	 * @return boolean
	 */
	public function isEnable() {
			return Mage::getStoreConfig('addressvalidator/addressvalidator_settings/addressvalidator_active');
	}
	
	/**
	 * get value for api user key
	 * @return string
	 */
	public function getApiKey() {
			Mage::getStoreConfig('addressvalidator/addressvalidator_settings/addressvalidator_user_key');
	}
	
	/**
	 * get value for api url
	 * @return string
	 */
	public function getApiUrl() {
			Mage::getStoreConfig('addressvalidator/ubercx_api_url');
	}
}
