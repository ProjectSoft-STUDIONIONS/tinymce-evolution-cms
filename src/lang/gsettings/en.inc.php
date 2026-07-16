<?php
/**
 * Function:       English language file for gsettings
 * Encoding:       ISO-Latin-1
 * Author:         Jeff Whitfield, yama, Deesen
 * Date:           2016/02/19
 * Version:        4.5.7.0
 * MODX version:   0.9.5-1.1
*/

$filename = __DIR__ . '/english.inc.php';
$contents = file_get_contents($filename);
eval('?>' . $contents);
