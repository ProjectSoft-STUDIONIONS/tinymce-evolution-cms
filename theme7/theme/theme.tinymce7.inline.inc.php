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

// Подключаем плагины
$this->set('plugins', 'advlist lists autolink autoresize save image modxlink table visualblocks media codemirror', 'string');

// Menu Bar
// $this->set('menubar', 'file edit view insert format tools table', 'string' );
$this->set('menubar', false, 'bool' );

// Status Bar отключаем
$this->set('statusbar', false, 'bool' );

// Первая строка тулбара
$this->set('toolbar1', 'undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | link unlink openlink | media image | codemirror', 'string');

// Вторая строка тулбара отключаем
$this->set('toolbar2', NULL, 'string');

// Третья строка тулбара
$this->set('toolbar3', NULL, 'string');

// Четвёртая строка тулбара
$this->set('toolbar4', NULL, 'string');

// Форматы
$this->set('formats', '{
	"alignleft": {
		"selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,td,th,dl,dt,dd,img,audio,video",
		"classes": "text-left"
	},
	"aligncenter": {
		"selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,td,th,dl,dt,dd,img,audio,video",
		"classes": "text-center"
	},
	"alignright": {
		"selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,td,th,dl,dt,dd,img,audio,video",
		"classes": "text-right"
	},
	"alignfull": {
		"selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,td,th,dl,dt,dd,img,audio,video",
		"classes": "text-justify"
	}
}', 'json');
$this->set('block_formats', 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4; Header 5=h5; Header 6=h6', 'string');
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
