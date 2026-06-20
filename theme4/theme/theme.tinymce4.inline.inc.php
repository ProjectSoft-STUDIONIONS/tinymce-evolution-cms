<?php
if (!defined('MODX_BASE_PATH')) { die('What are you doing? Get out of here!'); }
/*
 * All available config-params of %uppercase%
 * Конфиг-параметры %uppercase%
 * https://www.tinymce.com/docs/configure/
 *
 * Приведенная ниже настройка конфигурации по умолчанию гарантирует, что все параметры редактора имеют резервное значение, а тип для каждого ключа известен.
 * $this->set($editorParam, $value, $type, $emptyAllowed=false)
 *
 * $editorParam = параметр для установки
 * $value = значение для установки
 * $type = строка, число, логическое значение, json (массив или строка)
 * $emptyAllowed = true, false (разрешает параметр: '' вместо возврата к значениям по умолчанию)
 * Если $editorParam пуст, а $emptyAllowed равен true, $defaultValue будет игнорироваться
 *
 * $this->modxParams содержит массив фактических настроек Modx/user-settings
 *
 * */

// Используемые плагины
$this->set('plugins', 'save autolink lists layer table modxlink image media contextmenu paste visualchars nonbreaking visualblocks charmap wordcount code autoresize template spellchecker codemirror', 'string');

// Первая строка
$this->set('toolbar1', 'save | undo redo | cut copy paste pastetext | visualchars | visualblocks | code | codemirror', 'string');

// Вторая строка
$this->set('toolbar2', 'formatselect | bold italic underline strikethrough subscript superscript removeformat | alignleft aligncenter alignright alignjustify | bullist numlist | blockquote', 'string');

// Третья строка
$this->set('toolbar3', 'table | image media | link unlink openlink | charmap | nonbreaking', 'string');

// Четвёртая строка (отключаем)
$this->set('toolbar4', false, 'bool');

// Основное меню (отключаем)
$this->set('menubar', false, 'bool');

// Статус бар (отключаем)
$this->set('statusbar', false, 'bool' );

// Выставляем свой формат выравнивания текста
$this->set('formats', '{
	alignleft: {
		selector: "p,h1,h2,h3,h4,h5,h6,table,td,th,div,ul,ol,li,dl,dt,dd,a,span,strong,i,em,b,time",
		classes: "text-left"
	},
	aligncenter: {
		selector: "p,h1,h2,h3,h4,h5,h6,table,td,th,div,ul,ol,li,dl,dt,dd,a,span,strong,i,em,b,time",
		classes: "text-center"
	},
	alignright: {
		selector: "p,h1,h2,h3,h4,h5,h6,table,td,th,div,ul,ol,li,dl,dt,dd,a,span,strong,i,em,b,time",
		classes: "text-right"
	},
	alignjustify: {
		selector: "p,h1,h2,h3,h4,h5,h6,table,td,th,div,ul,ol,li,dl,dt,dd,a,span,strong,i,em,b,time",
		classes: "text-justify"
	},
	bold: {
		inline : "strong"
	},
	italic: {
		inline : "em"
	},
	underline: {
		inline : "u"
	},
	strikethrough: {
		inline : "del"
	}
}', 'json');

// Удаляем все ненужные стили в таблицах, изображениях, фреймах
$this->set('invalid_styles', '{
	"table": "width height border border-width border-style border-collapse",
	"tr" : "width height border border-width border-style border-collapse",
	"th" : "width height border border-width border-style border-collapse",
	"td" : "width height border border-width border-style border-collapse",
	"img" : "width height border border-width border-style float",
	"iframe" : "width height border border-width border-style float"
}', 'json');

// Классы для таблицы
$this->set('table_class_list', '[
	{
		title: "None",
		value: "table"
	},
	{
		title: "Table Hover",
		value: "table-hover"
	},
	{
		title: "Table Bordered",
		value: "table-bordered"
	},
	{
		title: "Table Bordered Hover",
		value: "table-bordered-hover"
	},
	{
		title: "Table Bordered Striped",
		value: "table-bordered-striped"
	},
	{
		title: "Table Bordered Striped Hover",
		value: "table-bordered-striped-hover"
	},
	{
		title: "Table Striped",
		value: "table-striped"
	},
	{
		title: "Table Striped Hover",
		value: "table-striped-hover"
	}
]', 'json');

// По умолчанию class таблицы имеет значение table-bordered
$this->set('table_default_attributes', '{
	"class": "table-bordered"
}', 'json');

// Если true, то отступы и заполнение ячеек применяются к элементу таблицы через CSS-стили (например, border-spacing для border-spacing и padding для padding в элементах td).
// Если false, то эти параметры добавляются в виде атрибутов к элементу таблицы.
// Устанавливаем false, т. к. мы определяем стили в файле стилей, который подключаем к редактору
// через параметр content_css. Вернее через конфигурацию системы в параметре editor_css_path
$this->set('table_style_by_css', true, 'bool');

// Отключаем возможность вводить значения стиля, цвета границы и фона для таблиц
$this->set('table_advtab', false, 'bool');
// Отключаем возможность вводить значения стиля, цвета границы и фона для свойств ячейки
$this->set('table_cell_advtab', false, 'bool');
// Отключаем возможность вводить значения стиля, цвета границы и фона для свойств строки
$this->set('table_row_advtab', false, 'bool');
// Отключаем некоторые параметры, доступные пользователю при вставке или редактировании таблицы
$this->set('table_appearance_options', false, 'bool');

// Заголовок таблицы
$this->set('table_header_type', 'thead', 'string');

// Ресайзер Таблицы отключаем
$this->set('table_resize_bars', false, 'bool');


// Классы изображения
$this->set('image_class_list', '[
	{
		title: "Нет",
		value: ""
	},
	{
		title: "Image Responsive",
		value: "img-responsive"
	},
	{
		title: "Image Responsive Block",
		value: "img-responsive-block"
	}
]', 'json');

// Ресайз редактора
// Отступ снизу
$this->set('autoresize_bottom_margin', 15, 'number');
// Минимальная высота
$this->set('autoresize_min_height', 100, 'number');

// ifrme video (media plugin)
$this->set('sandbox_iframes', true, 'bool');
// Разрешённые домены для iframe
$this->set('sandbox_iframes_exclusions', '[
	"youtube.com",
	"youtu.be",
	"vimeo.com",
	"player.vimeo.com",
	"codepen.io",
	"rutube.ru",
	"yandex.ru"
 ]', 'json');

// iframe шаблон вставки видео. Если сделать полный html блок, то он вставится, но удалять его нужно руками.
$this->set('iframe_template_callback', '(data) => `<iframe class="embed-responsive embed-responsive-16by9" src="${data.source}" allow="clipboard-write; autoplay" allowfullscreen="allowfullscreen"></iframe>`', 'object');

// Отключает ресайз изображений, iframe, ...etc
$this->set('object_resizing', false, 'bool');

// Настройки для изображений
$this->set('image_dimensions', false, 'bool');
$this->set('image_description', false, 'bool');

// включение/отключение rel target
// true - отключить установку аттрибута
// false - включить установку аттрибута
// Отключать установку не рекомендуется, но для определённых типов сайтов это можно.
$this->set('allow_unsafe_link_target', true, 'bool');

// По умолчанию новое окно, но не всегда работает
$this->set('link_default_target', '_blank', 'string');

// Установка классов для ссылки.
$this->set('link_class_list', '[
	{
		"title": "Not",
		"value": ""
	},
	{
		"title": "FancyBox класс",
		"value": "fancybox-link"
	}
]', 'json');

// Показать блоки и символы
$this->set('visualblocks_default_state', true, 'bool');
$this->set('visualchars_default_state', true, 'bool');

// Вставить как текст
$this->set('paste_as_text', true, 'bool');

// Codemirror Plugin
$this->set('codemirror', '{
	indentOnInit: true,
	fullscreen: false,
	path: "codemirror",
	config: {
		mode: "application/x-httpd-php",
		lineNumbers: true,
		indentUnit: 4,
		tabSize: 4,
		theme: "mariana"
	},
	width: 800,
	height: 600,
	saveCursorPosition: true,
	jsFiles: [
		"mode/php/php.js",
		"addon/edit/matchbrackets.js",
		"mode/xml/xml.js",
		"mode/javascript/javascript.js",
		"mode/css/css.js",
		"mode/htmlmixed/htmlmixed.js",
		"addon/selection/active-line.js"
	],
	cssFiles: [
		"lib/codemirror.css",
		"theme/mariana.css"
	]
}', 'object'); // mariana

// Старт и сохранение
$this->set('setup', '(editor) => { editor.on("change", (e) => { documentDirty=true; }); }',  'object');
$this->set('save_onsavecallback', '() => { documentDirty=false; document.getElementById("stay").value = 2; document.mutate.save.click(); }',  'object');
