<?php
/* Check plugin.tinymce.php for details */

if (!defined('MODX_BASE_PATH')) { die('What are you doing? Get out of here!'); }

// Init
if(!class_exists('modxRTEbridge')) {
	if( file_exists(MODX_BASE_PATH."assets/lib/class.modxRTEbridge.php")) {
		require_once(MODX_BASE_PATH."assets/lib/class.modxRTEbridge.php");
	} else {
		// Здесь то, что должно остановить процесс evo
	}
}

require_once(MODX_BASE_PATH."assets/plugins/%lowercase%/bridge.%lowercase%.inc.php");

$e = &$modx->event;

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
			$script = $rte->getEditorScript() . "<script type=\"text/javascript\">
	let editorCallback = null;
	let currentFieldId = null;
	const icon_header = \"fa fa-folder-open\";
	function openFileManagerForTinyMCE(field_type, callback, directory = '') {
		let evoMod = window.modx || window.parent.modx || window.parent.parent.modx;
		let popup;
		let pWidth;
		let pHeight;
		let myReq;
		let intIframe;
		let popupIframe;

		const width = window.innerWidth * 1;
		const height = window.innerHeight * 0.6;
		const screenWidth = window.screen.width;
		const screenHeight = window.screen.height;
		const left = (screenWidth - width) / 2;
		const top = (screenHeight - height) / 2;

		const fieldId = currentFieldId || 'default_field_id';

		const url = '/manager/media/browser/" . $modx->getConfig('which_browser'). "/browse.php?opener=%lowercase%&type='+field_type+'&field_id=' + encodeURIComponent(fieldId) + directory;
		const eventHandler = (event) => {
			//
			let data = typeof event.data == \"string\" ? JSON.parse(event.data) : event.data;
			switch(data.type){
				case \"kcfinder:change-title\":
					if(evoPopupHeader) {
						const regex = /^(kcfinder)/i;
						const subst = `<i class=\"${icon_header}\"></i>$1`;
						data.title = data.title.replace(regex, subst);
						evoPopupHeader.innerHTML = data.title;
					}
					break;
			}
		};
		const iframeLoad = function(e) {
			if (e.target.contentDocument.title) {
				// Если есть шапка попапа
				if(evoPopupHeader) {
					// Перезапись заголовка
					const regex = /^(kcfinder)/i;
					const subst = `<i class=\"${icon_header}\"></i>$1`;
					evoPopupHeader.innerHTML = e.target.contentDocument.title.replace(regex, subst);
					// Остановить прелоадер
					evoMod.main.stopWork();
				}
			}
		}
		// Ресайз попапа с kcfinder
		// По ресайзу есть идея переделать.
		// Пока оставим как есть
		const eventResizeHandler = function() {
			if ( popup ) {
				let w,
					h,
					cw = Cookies.get('KCFINDER_%lowercase%_popup_width') || '99%',
					ch = Cookies.get('KCFINDER_%lowercase%_popup_height') || '99%';
				w = parseInt(100 * popup.el.offsetWidth / window.innerWidth) + '%';
				h = parseInt(100 * popup.el.offsetHeight / window.innerHeight) + '%';
				if ( w != parseInt(cw) + '%' ) {
					Cookies.set('KCFINDER_%lowercase%_popup_width', parseInt(w), { expires: 7, path: '' });
				}
				if ( h != parseInt(ch) + '%' ) {
					Cookies.set('KCFINDER_%lowercase%_popup_height', parseInt(h), { expires: 7, path: '' });
				}
				myReq = requestAnimationFrame(eventResizeHandler);
			} else {
				cancelAnimationFrame(myReq);
			}
		};
		pWidth = Cookies.get('KCFINDER_%lowercase%_popup_width') || '99%';
		pHeight = Cookies.get('KCFINDER_%lowercase%_popup_height') || '99%';
		pWidth = parseInt(pWidth) > 99 ? '99%' : pWidth;
		pHeight = parseInt(pHeight) > 99 ? '99%' : pHeight;
		// Открываем через API modx
		if(typeof evoMod == 'object') {
			window.KCFinder = {
				callBack: function(url) {
					window.KCFinder = null;
					callback(url);
				}
			};
			popup = evoMod.popup(
				{
					addclass: 'kcfinder_popup',
					url: url,
					title: window.fmolang['kcfinder'],
					icon: icon_header,
					iframe: 'iframe',
					position: 'center center',
					width: parseInt(pWidth) + '%',
					height: parseInt(pHeight) + '%',
					hide: 0,
					hover: 0,
					resize: !0,
					overlay: 1,
					overlayclose: 1,
					onclose: function(e, obj) {
						if(typeof reloadElementsInTree == 'function'){
							setTimeout(reloadElementsInTree, 400);
						}
						popupIframe && popupIframe.removeEventListener('load', iframeLoad)
						// Удалить
						popupIframe = null;
						evoPopupHeader = null;
						window.removeEventListener('message', eventHandler);
						// остановка
						cancelAnimationFrame(myReq);
						popup = null;
					},
					// Если подобная функция всё же будет
					onshow: function(e, obj) {
						evoPopupHeader = obj.querySelector('.evo-popup-header');
						popupIframe = obj.querySelector('iframe');
						// Подписываемся на события
						window.addEventListener('message', eventHandler);
						// Старт ресайза.
						myReq = requestAnimationFrame(eventResizeHandler);
						popupIframe && popupIframe.addEventListener('load', iframeLoad);
					},
					wrap: document.body
				}
			);
		}
	}

	function SetUrl(url) {
		if (editorCallback) {
			editorCallback(url);
			editorCallback = null;
		}
	}
	</script>";
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
