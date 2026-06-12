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
$this->set('language', $lang, 'string', 'en');

// @todo: make "styleprops"-button work with "compat3x-plugin"?
// http://archive.tinymce.com/forum/viewtopic.php?pid=115507#p115507

$this->set('plugins', 'anchor save autosave advlist modxlink image imagetools searchreplace print contextmenu paste fullscreen nonbreaking visualchars media youtube code', 'string');
$this->set('toolbar1', 'undo redo selectall | pastetext | search replace | nonbreaking hr charmap | image link unlink anchor media youtube | removeformat | fullscreen print code help', 'string');
$this->set('toolbar2', 'bold italic underline strikethrough subscript superscript | blockquote | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | styleselect formatselect | styleprops', 'string');

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
