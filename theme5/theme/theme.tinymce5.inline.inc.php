<?php
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

// Устанавливаем язык TinyMCE
$evo = evo();
$lang = $evo->config['manager_language'];

// Под EVO 1.4.x нужен проход по языкам
$this->set('language', $lang, 'string', 'en');

// Отключим кеширование скриптов. Это тест.
$this->set('cache_suffix', '?' . date("Ymd-Hi"), 'string');

// Базовый URL для документа
$this->set('document_base_url', MODX_SITE_URL, 'string', '/');

// Подключаем плагины
$this->set('plugins', 'autolink autoresize save image imagetools modxlink codemirror table visualblocks media', 'string');

// Menu Bar
$this->set('menubar', 'file edit view insert format tools table', 'string' );

// Status Bar
$this->set('statusbar', false, 'bool' );

// Первая строка тулбара
$this->set('toolbar1', 'undo redo | formatselect | bold strikethrough | alignleft aligncenter alignright | link unlink openlink | media image | codemirror', 'string');

// Вторая строка тулбара
$this->set('toolbar2', NULL, 'string');

// Третья строка тулбара
$this->set('toolbar3', NULL, 'string');

// Четвёртая строка тулбара
$this->set('toolbar4', NULL, 'string');

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
		"theme": "cobalt"
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

// Забираем css файлы из настроек если они есть
// Добавляем хэшь для отключения кэша скриптов
try {
	$css_conf = trim($evo->config["editor_css_path"]);
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
