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

// @todo: make "styleprops"-button work with "compat3x-plugin"?
// http://archive.tinymce.com/forum/viewtopic.php?pid=115507#p115507

// @todo: Is this list complete for a "full"-theme?
$this->set('plugins', 'autoresize anchor autolink advlist lists pagebreak table save hr modxlink image emoticons insertdatetime preview media searchreplace print code paste directionality fullscreen noneditable visualchars nonbreaking template autosave visualblocks charmap wordcount codesample codemirror', 'string');
$this->set('toolbar1', 'save print newdocument | undo redo | searchreplace | cut copy paste pastetext | visualchars visualblocks code codemirror | preview fullscreen', 'string');
$this->set('toolbar2', 'styleselect formatselect fontselect fontsizeselect | forecolor backcolor', 'string');
$this->set('toolbar3', 'bold italic underline strikethrough subscript superscript removeformat | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | ltr rtl', 'string');
$this->set('toolbar4', 'image media | link unlink anchor | table | pagebreak hr | template codesample nonbreaking insertdatetime | charmap emoticons', 'string');


// Ресайз редактора
$this->set('autoresize_bottom_margin', 0, 'number');
$this->set('autoresize_min_height', 100, 'number');

// ifrme video (media plugin)
$this->set('sandbox_iframes', false, 'bool');
$this->set('iframe_template_callback', '(data) => `<iframe class="embed-responsive embed-responsive-16by9" src="${data.source}" allow="clipboard-write; autoplay" allowfullscreen="allowfullscreen"></iframe>`', 'object');

// $this->set('object_resizing', false, 'bool');
// Ресайзер Таблицы отключаем
$this->set('table_resize_bars', false, 'bool');

// Заголовок таблицы
$this->set('table_header_type', 'thead', 'string');

// Настройки для изображений
$this->set('image_dimensions', false, 'bool');
$this->set('image_description', false, 'bool');

//
$this->set('allow_unsafe_link_target', false, 'bool');

// По умолчанию новое окно
$this->set('link_default_target', '_blank', 'string');

// Rel list
$this->set('link_rel_list', '[
	{
		"title": "Default Rel",
		"value": "noopener"
	},
	{
		"title": "Rel noreferrer",
		"value": "noopener noreferrer nofollow"
	},
    {
    	"title": "Rel external",
    	"value": "noopener noreferrer nofollow external"
    }
]', 'json');

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
	"iframe": "source.php",
	"config": {
		"mode": "application/x-httpd-php",
		"lineNumbers": true,
		"indentUnit": 4,
		"tabSize": 4,
		"theme": "mariana"
	}
}', 'object'); // mariana

// Показать блоки и символы
$this->set('visualblocks_default_state', true, 'bool');
$this->set('visualchars_default_state', true, 'bool');

// Вставить как текст
$this->set('paste_as_text', true, 'bool');

// Старт и сохранение
$this->set('setup', '(ed) => { ed.on("change", (e) => { documentDirty=true; }); }',  'object');
$this->set('save_onsavecallback', '() => { documentDirty=false; document.getElementById("stay").value = 2; document.mutate.save.click(); }',  'object');
