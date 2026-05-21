<?php
// Get Template from resource for %uppercase%
// Based on get_template.php for TinyMCE3 by Yamamoto
//

$self = 'assets/plugins/%lowercase%/connector.%lowercase%.templates.php';
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

$templatesArr = $bridge->getTemplateChunkList();    // $templatesArr could be modified/bridged now for different editors before sending

// Make output a real JavaScript file!
header('Content-type: application/x-javascript');
header('pragma: no-cache');
header('expires: 0');
echo json_encode($templatesArr);
