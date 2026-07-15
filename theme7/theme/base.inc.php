<?php
if (!defined('MODX_BASE_PATH')) { die('What are you doing? Get out of here!'); }
/*
 * All available config-params of %uppercase%
 * https://www.tinymce.com/docs/configure/
 *
 * Belows default configuration setup assures all editor-params have a fallback-value, and type per key is known
 * $this->set( $editorParam, $value, $type, $emptyAllowed=false )
 *
 * $editorParam     = param to set
 * $value           = value to set
 * $type            = string, number, bool, json (array or string)
 * $emptyAllowed    = true, false (allows param:'' instead of falling back to default)
 * If $editorParam is empty and $emptyAllowed is true, $defaultValue will be ignored
 *
 * $this->modxParams holds an array of actual Modx- / user-settings
 *
 * */

// %uppercase% - Base config --- See gsettings/bridge.%lowercase%.inc.php for more base params

// Migration-Info
// These plugins where removed in 4.0: advhr, advimage, advlink, iespell, inlinepopups, style, emotions, xhtmlxtras
// These are the new plugins in 4.0:   anchor, charmap, compat3x, hr, image, link, emoticons, code, textcolor


// $this->set('toolbar_items_size', 'small',                        'string');      // @todo: No docs - deprecated parameter?
// @todo: make "styleprops"-button work with "compat3x-plugin"? http://archive.tinymce.com/forum/viewtopic.php?pid=115507#p115507
// @todo: "pasteword"-button is now commercial -> https://www.tinymce.com/docs/enterprise/paste-from-word/
// @todo: layer-Plugin: Buttons broken
// @todo: selectall-Button broken

// Отключим кеширование скриптов.
$this->set('cache_suffix', '?' . date("Ymd-Hi"), 'string');

$this->set('skin', 'lightgray', 'string' ); // Set default skin (setting param first time sets its value also as default val)
$this->set('skin', $this->modxParams['skin'] ); // Overwrite with Modx-setting (if empty, default is used))

$this->set('theme', 'modern', 'string' ); // Set default skin (setting param first time sets its value also as default val)
$this->set('theme', $this->modxParams['skintheme'] ); // Overwrite with Modx-setting (if empty, default is used))

$this->set('width', $this->pluginParams['width'], 'string' ); // https://www.tinymce.com/docs/configure/editor-appearance/#width
$this->set('height', $this->pluginParams['height'], 'string' ); // https://www.tinymce.com/docs/configure/editor-appearance/#height

// @todo: Make optional in Modx-configuration?
$this->set('menubar', true, 'bool' ); // https://www.tinymce.com/docs/configure/editor-appearance/#menubar
$this->set('statusbar', true, 'bool' ); // https://www.tinymce.com/docs/get-started/customize-ui/#hidingthestatusbar

$this->set('document_base_url', MODX_SITE_URL, 'string' ); // https://www.tinymce.com/docs/configure/url-handling/#document_base_url
$this->set('entity_encoding', $this->pluginParams['entityEncoding'], 'string'); // https://www.tinymce.com/docs/configure/content-filtering/#encodingtypes
$this->set('entities', isset($this->pluginParams['entities']) ? $this->pluginParams['entities'] : '', 'string');      // https://www.tinymce.com/docs/configure/content-filtering/#entities

$this->set('language', $this->modx->config['manager_language'], 'string', 'en'); // https://www.tinymce.com/docs/configure/localization/#language
if($this->lang('lang_code') != 'en')
    $this->set('language_url', $this->pluginParams['base_url'].'tinymce/langs/'. $this->lang('lang_code') .'.js', 'string'); // https://www.tinymce.com/docs/configure/localization/#language_url

$this->set('schema', $this->modxParams['schema'], 'string' ); // https://www.tinymce.com/docs/configure/content-filtering/#schema
$this->set('element_format', $this->modxParams['element_format'], 'string' ); // https://www.tinymce.com/docs/configure/content-filtering/#element_format
// $this->set('inline', true, 'bool' ); // https://www.tinymce.com/docs/configure/integration-and-setup/#inlineeditingmodeonadivelementwithideditable

// Avoid set empty content_css - accepts comma-separated list of multiple css-files
if( !empty( $modx->config['editor_css_path'] )) {
    $this->set('content_css', explode(',',$modx->config['editor_css_path']), 'array'); // https://www.tinymce.com/docs/configure/content-appearance/#content_css
};

// Load templates and chunks by connector
// $this->set('templates', $this->pluginParams['base_url'].'connector.%lowercase%.templates.php', 'string' ); // https://www.tinymce.com/docs/plugins/template/#templates

$this->set('image_caption', true, 'bool' ); // https://www.tinymce.com/docs/plugins/image/#image_caption
$this->set('image_advtab', 'small', 'string' ); // https://www.tinymce.com/docs/plugins/image/#image_advtab
$this->set('image_advtab', true, 'bool' ); // https://www.tinymce.com/docs/plugins/image/#image_advtab // replacement for 3.x-plugin advimage
$this->set('image_class_list', '[{title: "None", value: ""},{title: "Float left", value: "justifyleft"},{title: "Float right", value: "justifyright"},{title: "Image Responsive",value: "img-responsive"}]', 'json' );

// https://www.tinymce.com/docs/plugins/spellchecker/
// $this->set('browser_spellcheck', ($this->pluginParams['browser_spellcheck'] == 'enabled' ? true : false), 'bool' );

if($this->pluginParams['paste_as_text'] == 'enabled') {
	// https://www.tinymce.com/docs/plugins/paste/#paste_as_text
	$this->set('paste_as_text', true, 'bool' );
} else {
	// https://www.tinymce.com/docs/plugins/paste/#paste_word_valid_elements
	// $this->set('paste_word_valid_elements', 'a[href|name],p,b,strong,i,em,h1,h2,h3,h4,h5,h6,table,th,td[colspan|rowspan],tr,thead,tfoot,tbody,br,hr,sub,sup,u', 'string');
}

// @todo: final base-setup like tinymce3 "default"-theme?
$this->set('plugins', 'anchor visualblocks autolink autosave save advlist lists modxlink media table image code', 'string'); // https://www.tinymce.com/docs/get-started/basic-setup/#pluginconfiguration
$this->set('toolbar1', 'undo redo | bold forecolor backcolor strikethrough formatselect fontsizeselect pastetext code | fullscreen help', 'string', false);
$this->set('toolbar2', 'image media link unlink anchor | alignleft aligncenter alignright | bullist numlist | blockquote outdent indent | table hr | visualblocks styleprops removeformat', 'string', true);

// Bridge does not return NULL, and does not use this->set() itself, so these parameters must be set at least once..
// Params get translated by bridge because it does not return NULL, so the returned values will be used
$this->set('style_formats', array(), 'json'); // https://www.tinymce.com/docs/configure/content-formatting/#style_formats
$this->set('block_formats', '', 'string'); // https://www.tinymce.com/docs/configure/content-formatting/#block_formats
$this->set('forced_root_block', '', 'string'); // https://www.tinymce.com/docs/configure/content-filtering/#forced_root_block

$this->set('setup', 'function(ed) { ed.on("change", function(e) { documentDirty=true; }); }',  'object');
$this->set('save_onsavecallback', 'function () { documentDirty=false; document.getElementById("stay").value = 2; document.mutate.save.click(); }',  'object');

// https://www.tinymce.com/docs/themes/mobile/
$this->set('mobile', '{
	theme: "mobile", 
	plugins: [ "autosave", "lists", "autolink" ],
	toolbar: [ "undo", "bold", "italic", "styleselect" ]
}',	'json' );

// Вырубаем бренд
$this->set('branding', false, 'bool');
// Вырубаем промо
$this->set('promotion', false, 'bool');

// Конфигурвцию codemirror вставляем здесь
// Codemirror Plugin
$this->set('codemirror', '{
	"cssFiles": [
		"lib/codemirror.css",
		"theme/mariana.css"
	],
	"jsFiles": [
		"mode/php/php.js",
		"addon/edit/matchbrackets.js",
		"mode/xml/xml.js",
		"mode/javascript/javascript.js",
		"mode/css/css.js",
		"mode/htmlmixed/htmlmixed.js",
		"addon/selection/active-line.js"
	],
	"indentOnInit": true,
	"iframe": "source.php",
	"config": {
		"mode": "application/x-httpd-php",
		"lineNumbers": true,
		"indentUnit": 4,
		"tabSize": 4,
		"theme": "mariana"
	}
}', 'object'); // mariana

// Забираем css файлы из настроек если они есть
// Добавляем хэшь для отключения кэша скриптов
try {
	$css_conf = trim($this->modx->config["editor_css_path"]);
	$pattern = "/([|,;]+)/";
	$css = preg_split($pattern, $css_conf, -1, PREG_SPLIT_NO_EMPTY);
	$array_css = [];
	foreach ($css as $key => $value):
		$value = trim($value, "/");
		if(is_file(MODX_BASE_PATH . $value)):
			$hash = filemtime(MODX_BASE_PATH . $value);
			$value .= '?hash=hash' . $hash;
			$array_css[] = "/" . $value;
		endif;
	endforeach;
	// Если файлы есть - добавляем
	if(count($array_css)):
		$files_css = json_encode($array_css, JSON_OBJECT_AS_ARRAY | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
		$this->set('content_css', $files_css, 'json');
	endif;
} catch (Exception $e) {}
