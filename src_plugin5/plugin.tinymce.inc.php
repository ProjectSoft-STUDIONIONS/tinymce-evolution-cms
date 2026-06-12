<?php
/* Check plugin.tinymce.php for details */

if (!defined('MODX_BASE_PATH')) { die('What are you doing? Get out of here!'); }

$e = &$modx->event;

// Init
if(!class_exists('modxRTEbridge')) {
	if( file_exists(MODX_BASE_PATH."assets/lib/class.modxRTEbridge.php")) {
		require_once(MODX_BASE_PATH."assets/lib/class.modxRTEbridge.php");
	} else {
		// Здесь должно остановить процесс evo
		echo "Не найден класс modxRTEbridge! " . __FILE__ . " Линия: " . __LINE__;
		return;
	}
}

require_once(MODX_BASE_PATH."assets/plugins/%lowercase%/bridge.%lowercase%.inc.php");

if (!isset($inlineMode)) {
	$inlineMode = '';
}

if($e->name == 'OnWebPagePrerender' && $inlineMode == 'enabled') {
	$options = array('editable'=>array(
		'theme'=>isset($inlineTheme) ? $inlineTheme : 'inline'
	));
} else {
	$options = isset($options) && is_array($options) ? $options : array();
}

$rte = new %lowercase%bridge($options);

// true or 'full' for Debug-Infos in HTML-comments
$rte->setDebug(false);

$rte->pluginParams['customParams'] = !empty($rte->pluginParams['customParams']) ? ','. trim($rte->pluginParams['customParams'], ',') : '';

file_put_contents(dirname(__FILE__) . "/rte.txt", print_r($rte, true));

// Internal Stuff - Don´t touch!
// Show/Hide interface in Modx- / user-configuration
$showSettingsInterface = true;
$editorLabel = $rte->pluginParams['editorLabel'];

switch ($e->name) {
	// register for manager
	case "OnRichTextEditorRegister":
		$e->output($editorLabel);
		break;

	// render script for JS-initialization
	case "OnRichTextEditorInit":
		if ($editor === $editorLabel) {
			// Handle introtext-RTE
			if($introtextRte == 'enabled' && isset($rte->pluginParams['elements']) && !defined($editor . '_INIT_INTROTEXT')) {
				define($editor . '_INIT_INTROTEXT', 1);
				if(!in_array('introtext',$rte->pluginParams['elements'])) {
					$rte->pluginParams['elements'][]      = 'introtext';
					$rte->tvOptions['introtext']['theme'] = 'introtext';
				};
			}
			// Функция для открытия файл менеджера для TinyMCE-5.x-8.x
			$script = $rte->getEditorScript();
			$e->output($script);
		};
		break;

	// Inline-Mode
	case "OnLoadWebPageCache":
	case "OnLoadWebDocument":
		if($inlineMode == 'enabled' && isset($_SESSION['mgrValidated'])) {
			$output = &$modx->documentContent;
			$output = $rte->parseEditableIds($output);
			// Avoid breaking content / parsing of Modx-placeholders when editing (Inline-Mode)
			$rte->protectModxPhs();
		}
		break;

	case "OnParseDocument":
		if($inlineMode == 'enabled' && isset($_SESSION['mgrValidated'])) {
			$output = &$modx->documentOutput;
			$output = $rte->parseEditableIds($output);
			$rte->protectModxPhs();
		}
		break;

	case "OnWebPagePrerender":
		if($inlineMode == 'enabled' && isset($_SESSION['mgrValidated'])) {
			// https://www.tinymce.com/docs/configure/editor-appearance/#inline
			$rte->set('inline', true, 'bool');
			// Set missing plugin-parameter manually for Frontend
			$rte->setPluginParam('elements', 'editable');
			$rte->addEditorScriptToBody();
		}
		break;

	// render Modx- / User-configuration settings-list
	case "OnInterfaceSettingsRender":
		if( $showSettingsInterface === true ) {
			$html = $rte->getModxSettings();
			$e->output($html);
		};
		break;

	default :
		// important! stop here!
		return;
		break;
}
