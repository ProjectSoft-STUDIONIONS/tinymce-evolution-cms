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

// @todo: Modify plugins-list?
$this->set('plugins', 'anchor autolink lists spellchecker pagebreak layer table save hr modxlink image imagetools code emoticons insertdatetime preview media searchreplace print contextmenu paste directionality fullscreen noneditable visualchars nonbreaking youtube autosave advlist visualblocks charmap', 'string');
$this->set('toolbar1', 'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect', 'string');
$this->set('toolbar2', 'bullist numlist | outdent indent | undo redo | link unlink anchor image help code', 'string');
$this->set('toolbar3', 'hr removeformat visualblocks | subscript superscript | charmap', 'string');
