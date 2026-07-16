<?php
/*
 * Function:       Dutch language file for gsettings
 * Encoding:       utf-8
 * Author:         Jeff Whitfield
 *                 Stefan van Zanden (18-07-2009 Small changes to conform language used in the manager)
 * Date:           2016/02/19
 * Version:        4.5.7.0
 * MODX version:   0.9.5-1.1
*/
$filename = __DIR__ . '/nederlands-utf8.inc.php';
$contents = file_get_contents($filename);
$contents = mb_convert_encoding($contents, 'windows-1251', 'UTF-8');
eval('?>' . $contents);
