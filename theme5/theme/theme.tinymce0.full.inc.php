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

// @todo: Is this list complete for a "full"-theme?
$this->set('plugins', 'autoresize anchor autolink lists pagebreak table save hr customlink image notocoloremoji insertdatetime preview media searchreplace codemirror contextmenu directionality fullscreen visualchars nonbreaking autosave advlist visualblocks charmap wordcount codesample', 'string');
$this->set('toolbar1', 'save print newdocument | undo redo | searchreplace | cut copy | visualchars | visualblocks codemirror | preview fullscreen', 'string');
$this->set('toolbar2', 'styleselect formatselect fontselect fontsizeselect | forecolor backcolor', 'string');
$this->set('toolbar3', 'bold italic underline strikethrough subscript superscript removeformat | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | ltr rtl', 'string');
$this->set('toolbar4', 'image media | link unlink anchor | table | pagebreak hr | codesample nonbreaking insertdatetime | charmap notocoloremoji', 'string');
