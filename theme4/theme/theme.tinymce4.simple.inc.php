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

$this->set('plugins', 'autolink save emoticons modxlink paste image imagetools contextmenu', 'string');
$this->set('toolbar1', 'undo redo | bold strikethrough | alignleft aligncenter alignright | link unlink image emoticons | hr | help', 'string');
$this->set('toolbar2', NULL, 'string');

// Hide bars
$this->set('menubar',               false,                           'bool' );
$this->set('statusbar',             false,                           'bool' );
