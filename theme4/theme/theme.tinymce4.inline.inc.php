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

$this->set('plugins', 'autolink save image link codemirror table visualblocks', 'string');

$this->set('toolbar1', 'undo redo | formatselect | bold strikethrough | alignleft aligncenter alignright | link unlink image | codemirror', 'string');
$this->set('toolbar2', NULL, 'string');

// Hide bars
$this->set('menubar', 'file edit view insert format tools table', 'string' ); // https://www.tinymce.com/docs/configure/editor-appearance/#menubar
$this->set('statusbar', false, 'bool' ); // https://www.tinymce.com/docs/get-started/customize-ui/#hidingthestatusbar

// When using template-plugin/button, you can mark elements as noneditable via <div class="myclass mceNonEditable">Contents</div>
// https://www.tinymce.com/docs/plugins/noneditable/
// $this->appendSet('plugins', 'noneditable', ' ');

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
}', 'object');
