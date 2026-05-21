<?php

$self = 'assets/plugins/%lowercase%/connector.%lowercase%.saveProcessor.php';
$base_path = str_replace($self, '', str_replace('\\', '/', __FILE__));

define('MODX_API_MODE','true');
define('IN_MANAGER_MODE', true);
include_once("{$base_path}index.php");
if(!class_exists('modxRTEbridge')):
	if( file_exists(MODX_BASE_PATH."assets/lib/class.modxRTEbridge.php")): // Add Fall-Back for now
		require_once(MODX_BASE_PATH."assets/lib/class.modxRTEbridge.php");
	else:
		require_once(MODX_BASE_PATH."assets/plugins/%lowercase%/class.modxRTEbridge.php");
	endif;
endif;
require_once(MODX_BASE_PATH."assets/plugins/%lowercase%/bridge.%lowercase%.inc.php");

$bridge = new %lowercase%bridge();

$rid = isset($_POST['rid']) && is_numeric($_POST['rid']) ? (int)$_POST['rid'] : NULL;
$pluginName = isset($_POST['pluginName']) ? $_POST['pluginName'] : NULL;
$out = $rid ? $bridge->saveContentProcessor($rid, $pluginName) : 'No ID given';

echo (string)$out;  // returns ressource-id if successful, otherwise error-message
