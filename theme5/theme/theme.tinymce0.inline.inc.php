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
$this->set('language', $lang, 'string', false);

$this->set('plugins', 'autolink save image modxlink codemirror table visualblocks modxlink', 'string');

$this->set('toolbar1', 'undo redo | formatselect | bold strikethrough | alignleft aligncenter alignright | link unlink openlink image | codemirror', 'string');
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

$this->set('file_picker_callback', 'function (callback, value, meta) {
			let type = meta.filetype || "file";
			let field = meta.fieldname || "";
			let url = (typeof meta.original == "object") ? meta.original.value : "";
			if (type == "image") {
				type = "images";
			}
			if (type == "file") {
				type = "files";
			}
			if (type == "media") {
				type = "media";
			}
			var path = String(url).split("/"),
				directory = "";
			path.shift();
			path.pop();
			path = path.join("/");
			if(path!=""){
				directory += "&dir="+path;
			}
			openFileManagerForTinyMCE(type, callback, directory);
		}', 'object');
$this->set('file_picker_types', 'image file media', 'string');
