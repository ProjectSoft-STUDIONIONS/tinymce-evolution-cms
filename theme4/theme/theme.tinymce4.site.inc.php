<?php
/*
	* Конфиг-параметры TinyMCE4 для сайта
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
// Используемые шрифты. Шрифты указывать так, как они именуются в CSS
//$this->set('font_formats', 'Open Sans=Open Sans', 'string');

// Используемые плагины
$this->set('plugins', 'save autolink lists layer table modxlink image media contextmenu paste visualchars nonbreaking visualblocks charmap wordcount code autoresize template spellchecker emoticons codemirror', 'string');

// Первая строка тулбара
$this->set('toolbar1', 'save | undo redo | cut copy paste pastetext | visualchars | visualblocks | code | codemirror', 'string');

// Вторая строка тулбара
$this->set('toolbar2', 'formatselect | bold italic underline strikethrough subscript superscript removeformat | alignleft aligncenter alignright alignjustify | bullist numlist | blockquote', 'string');

// Третья строка тулбара
$this->set('toolbar3', 'table | image media | link unlink | charmap | nonbreaking | spellchecker | emoticons', 'string');

// Четвёртая строка тулбара
$this->set('toolbar4', false, 'bool');

// Основное меню (отключаем)
$this->set('menubar', false, 'bool');

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
// Думаю, что ещё не всё...
// Классы для таблицы
$this->set('table_class_list', '[
		{title: "None", value: "table"},
		{title: "Table Hover", value: "table-hover"},
		{title: "Table Bordered", value: "table-bordered"},
		{title: "Table Bordered Hover", value: "table-bordered-hover"},
		{title: "Table Bordered Striped", value: "table-bordered-striped"},
		{title: "Table Bordered Striped Hover", value: "table-bordered-striped-hover"},
		{title: "Table Striped", value: "table-striped"},
		{title: "Table Striped Hover", value: "table-striped-hover"}
	]', 'json');

// Удаляем все ненужные стили в таблицах, изображениях, фреймах
$this->set('invalid_styles', '{
		"table": "width height border border-width border-style border-collapse",
		"tr" : "width height border border-width border-style border-collapse",
		"th" : "width height border border-width border-style border-collapse",
		"td" : "width height border border-width border-style border-collapse",
		"img" : "width height border border-width border-style float",
		"iframe" : "width height border border-width border-style float"
	}', 'json');
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

// По умолчанию аттрибут таблицы class имеет значение table-bordered
$this->set('table_default_attributes', '{
		"class": "table-bordered"
	}', 'json');
$this->set('table_style_by_css', false, 'bool');

// Убираем дополнительные стили таблицы (бордерб бакграунд, ...)
$this->set('table_advtab', false, 'bool');
$this->set('table_cell_advtab', false, 'bool');
$this->set('table_row_advtab', false, 'bool');
$this->set('table_appearance_options', false, 'bool');

// Ресайзер Таблицы отключаем
$this->set('object_resizing', false, 'bool');
$this->set('table_resize_bars', false, 'bool');

// Заголовок таблицы
$this->set('table_header_type', 'thead', 'string');

// rel="noopener" disabled
$this->set('allow_unsafe_link_target', true, 'bool');

// Ссылки по умолчанию в новом окне
$this->set('link_default_target', '_blank', 'string');

// Настройки для изображений
$this->set('image_dimensions', false, 'bool');
$this->set('image_description', false, 'bool');

// Старт и сохранение
$this->set('setup', 'function(ed) { ed.on("change", function(e) { documentDirty=true; }); }',  'object');
$this->set('save_onsavecallback', 'function () { documentDirty=false; document.getElementById("stay").value = 2; document.mutate.save.click(); }',  'object');

// Проверка орфографии
$this->set('spellchecker_languages', 'Russian=ru,English=en', 'string');
$this->set('spellchecker_language', 'ru', 'string');
$this->set('spellchecker_rpc_url', '//speller.yandex.net/services/tinyspell', 'string');

// Показать блоки и символы
$this->set('visualblocks_default_state', true, 'bool');
$this->set('visualchars_default_state', true, 'bool');

// Вставить как текст
$this->set('paste_as_text', true, 'bool');

