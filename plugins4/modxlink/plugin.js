/**
 * Сборка modxlink без использования плагина autocomplete
 */

(function (domGlobals) {
		'use strict';

		tinymce.PluginManager.requireLangPack('modxlink');

		// URL плагина
		var urlPlugin = "";

		var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

		var global$1 = tinymce.util.Tools.resolve('tinymce.util.VK');

		var assumeExternalTargets = function (editorSettings) {
			return typeof editorSettings.link_assume_external_targets === 'boolean' ? editorSettings.link_assume_external_targets : false;
		};
		var hasContextToolbar = function (editorSettings) {
			return typeof editorSettings.link_context_toolbar === 'boolean' ? editorSettings.link_context_toolbar : false;
		};
		var getLinkList = function (editorSettings) {
			return editorSettings.link_list;
		};
		var hasDefaultLinkTarget = function (editorSettings) {
			return typeof editorSettings.default_link_target === 'string';
		};
		var getDefaultLinkTarget = function (editorSettings) {
			return editorSettings.default_link_target;
		};
		var getTargetList = function (editorSettings) {
			return editorSettings.target_list;
		};
		var setTargetList = function (editor, list) {
			editor.settings.target_list = list;
		};
		var shouldShowTargetList = function (editorSettings) {
			return getTargetList(editorSettings) !== false;
		};
		var getRelList = function (editorSettings) {
			return editorSettings.rel_list;
		};
		var hasRelList = function (editorSettings) {
			return getRelList(editorSettings) !== undefined;
		};
		var getLinkClassList = function (editorSettings) {
			return editorSettings.link_class_list;
		};
		var hasLinkClassList = function (editorSettings) {
			return getLinkClassList(editorSettings) !== undefined;
		};
		var shouldShowLinkTitle = function (editorSettings) {
			return editorSettings.link_title !== false;
		};
		var allowUnsafeLinkTarget = function (editorSettings) {
			return typeof editorSettings.allow_unsafe_link_target === 'boolean' ? editorSettings.allow_unsafe_link_target : false;
		};
		var Settings = {
			assumeExternalTargets: assumeExternalTargets,
			hasContextToolbar: hasContextToolbar,
			getLinkList: getLinkList,
			hasDefaultLinkTarget: hasDefaultLinkTarget,
			getDefaultLinkTarget: getDefaultLinkTarget,
			getTargetList: getTargetList,
			setTargetList: setTargetList,
			shouldShowTargetList: shouldShowTargetList,
			getRelList: getRelList,
			hasRelList: hasRelList,
			getLinkClassList: getLinkClassList,
			hasLinkClassList: hasLinkClassList,
			shouldShowLinkTitle: shouldShowLinkTitle,
			allowUnsafeLinkTarget: allowUnsafeLinkTarget
		};

		var global$2 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

		var global$3 = tinymce.util.Tools.resolve('tinymce.Env');
		var appendClickRemove = function (link, evt) {
			domGlobals.document.body.appendChild(link);
			link.dispatchEvent(evt);
			domGlobals.document.body.removeChild(link);
		};
		var open = function (url) {
			if (!global$3.ie || global$3.ie > 10) {
				var link = domGlobals.document.createElement('a');
				link.target = '_blank';
				link.href = url;
				link.rel = 'noreferrer noopener';
				var evt = domGlobals.document.createEvent('MouseEvents');
				evt.initMouseEvent('click', true, true, domGlobals.window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				appendClickRemove(link, evt);
			} else {
				var win = domGlobals.window.open('', '_blank');
				if (win) {
					win.opener = null;
					var doc = win.document;
					doc.open();
					doc.write('<meta http-equiv="refresh" content="0; url=' + global$2.DOM.encode(url) + '">');
					doc.close();
				}
			}
		};
		var OpenUrl = { open: open };

		var global$4 = tinymce.util.Tools.resolve('tinymce.util.Tools');

		var toggleTargetRules = function (rel, isUnsafe) {
			var rules = ['noopener'];
			var newRel = rel ? rel.split(/\s+/) : [];
			var toString = function (rel) {
				return global$4.trim(rel.sort().join(' '));
			};
			var addTargetRules = function (rel) {
				rel = removeTargetRules(rel);
				return rel.length ? rel.concat(rules) : rules;
			};
			var removeTargetRules = function (rel) {
				return rel.filter(function (val) {
					return global$4.inArray(rules, val) === -1;
				});
			};
			newRel = isUnsafe ? addTargetRules(newRel) : removeTargetRules(newRel);
			return newRel.length ? toString(newRel) : null;
		};
		var trimCaretContainers = function (text) {
			return text.replace(/\uFEFF/g, '');
		};
		var getAnchorElement = function (editor, selectedElm) {
			selectedElm = selectedElm || editor.selection.getNode();
			if (isImageFigure(selectedElm)) {
				return editor.dom.select('a[href]', selectedElm)[0];
			} else {
				return editor.dom.getParent(selectedElm, 'a[href]');
			}
		};
		var getAnchorText = function (selection, anchorElm) {
			var text = anchorElm ? anchorElm.innerText || anchorElm.textContent : selection.getContent({ format: 'text' });
			return trimCaretContainers(text);
		};
		var isLink = function (elm) {
			return elm && elm.nodeName === 'A' && elm.href;
		};
		var hasLinks = function (elements) {
			return global$4.grep(elements, isLink).length > 0;
		};
		var isOnlyTextSelected = function (html) {
			if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') === -1)) {
				return false;
			}
			return true;
		};
		var isImageFigure = function (node) {
			return node && node.nodeName === 'FIGURE' && /\bimage\b/i.test(node.className);
		};
		var link = function (editor, attachState) {
			return function (data) {
				editor.undoManager.transact(function () {
					var selectedElm = editor.selection.getNode();
					var anchorElm = getAnchorElement(editor, selectedElm);
					var linkAttrs = {
						href: data.href,
						target: data.target ? data.target : null,
						rel: data.rel ? data.rel : null,
						class: data.class ? data.class : null,
						title: data.title ? data.title : null
					};
					if (!Settings.hasRelList(editor.settings) && Settings.allowUnsafeLinkTarget(editor.settings) === false) {
						linkAttrs.rel = toggleTargetRules(linkAttrs.rel, linkAttrs.target === '_blank');
					}
					if (data.href === attachState.href) {
						attachState.attach();
						attachState = {};
					}
					if (anchorElm) {
						editor.focus();
						if (data.hasOwnProperty('text')) {
							if ('innerText' in anchorElm) {
								anchorElm.innerText = data.text;
							} else {
								anchorElm.textContent = data.text;
							}
						}
						editor.dom.setAttribs(anchorElm, linkAttrs);
						editor.selection.select(anchorElm);
						editor.undoManager.add();
					} else {
						if (isImageFigure(selectedElm)) {
							linkImageFigure(editor, selectedElm, linkAttrs);
						} else if (data.hasOwnProperty('text')) {
							editor.insertContent(editor.dom.createHTML('a', linkAttrs, editor.dom.encode(data.text)));
						} else {
							editor.execCommand('mceInsertLink', false, linkAttrs);
						}
					}
				});
			};
		};
		var unlink = function (editor) {
			return function () {
				editor.undoManager.transact(function () {
					var node = editor.selection.getNode();
					if (isImageFigure(node)) {
						unlinkImageFigure(editor, node);
					} else {
						editor.execCommand('unlink');
					}
				});
			};
		};
		var unlinkImageFigure = function (editor, fig) {
			var a, img;
			img = editor.dom.select('img', fig)[0];
			if (img) {
				a = editor.dom.getParents(img, 'a[href]', fig)[0];
				if (a) {
					a.parentNode.insertBefore(img, a);
					editor.dom.remove(a);
				}
			}
		};
		var linkImageFigure = function (editor, fig, attrs) {
			var a, img;
			img = editor.dom.select('img', fig)[0];
			if (img) {
				a = editor.dom.create('a', attrs);
				img.parentNode.insertBefore(a, img);
				a.appendChild(img);
			}
		};
		var Utils = {
			link: link,
			unlink: unlink,
			isLink: isLink,
			hasLinks: hasLinks,
			isOnlyTextSelected: isOnlyTextSelected,
			getAnchorElement: getAnchorElement,
			getAnchorText: getAnchorText,
			toggleTargetRules: toggleTargetRules
		};

		var global$5 = tinymce.util.Tools.resolve('tinymce.util.Delay');

		var global$6 = tinymce.util.Tools.resolve('tinymce.util.XHR');

		var attachState = {};

		var createLinkList = function (editor, callback) {
			var linkList = Settings.getLinkList(editor.settings);
			if (typeof linkList === 'string') {
				global$6.send({
					url: linkList,
					success: function (text) {
						callback(editor, JSON.parse(text));
					}
				});
			} else if (typeof linkList === 'function') {
				linkList(function (list) {
					callback(editor, list);
				});
			} else {
				callback(editor, linkList);
			}
		};
		var buildListItems = function (inputList, itemCallback, startItems) {
			var appendItems = function (values, output) {
				output = output || [];
				global$4.each(values, function (item) {
					var menuItem = { text: item.text || item.title };
					if (item.menu) {
						menuItem.menu = appendItems(item.menu);
					} else {
						menuItem.value = item.value;
						if (itemCallback) {
							itemCallback(menuItem);
						}
					}
					output.push(menuItem);
				});
				return output;
			};
			return appendItems(inputList, startItems || []);
		};
		var delayedConfirm = function (editor, message, callback) {
			var rng = editor.selection.getRng();
			global$5.setEditorTimeout(editor, function () {
				editor.windowManager.confirm(message, function (state) {
					editor.selection.setRng(rng);
					callback(state);
				});
			});
		};
		var showDialog = function (editor, linkList) {
			var data = {};
			var selection = editor.selection;
			var dom = editor.dom;
			var anchorElm, initialText;
			var win, onlyText, textListCtrl, linkListCtrl, relListCtrl, targetListCtrl, classListCtrl, linkTitleCtrl, value;
			var linkListChangeHandler = function (e) {
				var textCtrl = win.find('#text');
				if (!textCtrl.value() || e.lastControl && textCtrl.value() === e.lastControl.text()) {
					textCtrl.value(e.control.text());
				}
				win.find('#href').value(e.control.value());
			};
			var buildAnchorListControl = function (url) {
				var anchorList = [];
				global$4.each(editor.dom.select('a:not([href])'), function (anchor) {
					var id = anchor.name || anchor.id;
					if (id) {
						anchorList.push({
							text: id,
							value: '#' + id,
							selected: url.indexOf('#' + id) !== -1
						});
					}
				});
				if (anchorList.length) {
					anchorList.unshift({
						text: 'None',
						value: ''
					});
					return {
						name: 'anchor',
						type: 'listbox',
						label: 'Anchors',
						values: anchorList,
						onselect: linkListChangeHandler
					};
				}
			};
			var updateText = function () {
				if (!initialText && onlyText && !data.text) {
					this.parent().parent().find('#text')[0].value(this.value());
				}
			};
			var urlChange = function (e) {
				var meta = e.meta || {};
				if (linkListCtrl) {
					linkListCtrl.value(editor.convertURL(this.value(), 'href'));
				}
				global$4.each(e.meta, function (value, key) {
					var inp = win.find('#' + key);
					if (key === 'text') {
						if (initialText.length === 0) {
							inp.value(value);
							data.text = value;
						}
					} else {
						inp.value(value);
					}
				});
				if (meta.attach) {
					attachState = {
						href: this.value(),
						attach: meta.attach
					};
				}
				if (!meta.text) {
					updateText.call(this);
				}
			};
			var onBeforeCall = function (e) {
				e.meta = win.toJSON();
			};
			// Обаботка результата поиска
			var updateSearchResult = function(e) {
				var value = e.target.value;
				value = value.trim();
				if(value.length) {
					// Запрос
					var url = urlPlugin + "search.php";
					fetch(`${url}?q=` + encodeURIComponent(value))
						.then(response => {
							if (!response.ok) {
								throw new Error(tinymce.translate('Network response was not ok:') + " " + response.statusText);
							}
							return response.json();
						})
						.then(data => {
							// Очищаем блок результатов
							div.innerHTML = '';
							if (data && data.length > 0) {
								data.forEach(item => {
									// Создаём блок результата
									const resultItem = document.createElement('div');
									resultItem.textContent = item.pagetitle;
									resultItem.setAttribute('data-id', item.id);
									// Подписываемся на клик
									resultItem.addEventListener('click', (e) => {
										// Вставляем значение
										inputUrl.value = '[~' + item.id + '~]';
										// Очищаем блок результатов
										div.innerHTML = '';
										// Заполняем результат поиска
										input.value = item.title;
									});
									// Вставляем в блок результатов
									div.appendChild(resultItem);
								});
							}
						})
						.catch(error => {
							console.error(tinymce.translate('Error fetching search results for TinyMCE plugin:'), error);
							// Очищаем блок результатов
							div.innerHTML = '';
						});
				}else{
					// Очищаем блок результатов
					div.innerHTML = "";
				}
			};
			onlyText = Utils.isOnlyTextSelected(selection.getContent());
			anchorElm = Utils.getAnchorElement(editor);
			data.text = initialText = Utils.getAnchorText(editor.selection, anchorElm);
			data.href = anchorElm ? dom.getAttrib(anchorElm, 'href') : '';
			if (anchorElm) {
				data.target = dom.getAttrib(anchorElm, 'target');
			} else if (Settings.hasDefaultLinkTarget(editor.settings)) {
				data.target = Settings.getDefaultLinkTarget(editor.settings);
			}
			if (value = dom.getAttrib(anchorElm, 'rel')) {
				data.rel = value;
			}
			if (value = dom.getAttrib(anchorElm, 'class')) {
				data.class = value;
			}
			if (value = dom.getAttrib(anchorElm, 'title')) {
				data.title = value;
			}
			if (onlyText) {
				textListCtrl = {
					name: 'text',
					type: 'textbox',
					size: 40,
					label: 'Text to display',
					onchange: function () {
						data.text = this.value();
					}
				};
			}
			if (linkList) {
				linkListCtrl = {
					type: 'listbox',
					label: 'Link list',
					values: buildListItems(linkList, function (item) {
						item.value = editor.convertURL(item.value || item.url, 'href');
					}, [{
							text: 'None',
							value: ''
						}]),
					onselect: linkListChangeHandler,
					value: editor.convertURL(data.href, 'href'),
					onPostRender: function () {
						linkListCtrl = this;
					}
				};
			}
			if (Settings.shouldShowTargetList(editor.settings)) {
				if (Settings.getTargetList(editor.settings) === undefined) {
					Settings.setTargetList(editor, [
						{
							text: 'None',
							value: ''
						},
						{
							text: 'New window',
							value: '_blank'
						}
					]);
				}
				targetListCtrl = {
					name: 'target',
					type: 'listbox',
					label: 'Target',
					values: buildListItems(Settings.getTargetList(editor.settings))
				};
			}
			if (Settings.hasRelList(editor.settings)) {
				relListCtrl = {
					name: 'rel',
					type: 'listbox',
					label: 'Rel',
					values: buildListItems(Settings.getRelList(editor.settings), function (item) {
						if (Settings.allowUnsafeLinkTarget(editor.settings) === false) {
							item.value = Utils.toggleTargetRules(item.value, data.target === '_blank');
						}
					})
				};
			}
			if (Settings.hasLinkClassList(editor.settings)) {
				classListCtrl = {
					name: 'class',
					type: 'listbox',
					label: 'Class',
					values: buildListItems(Settings.getLinkClassList(editor.settings), function (item) {
						if (item.value) {
							item.textStyle = function () {
								return editor.formatter.getCssText({
									inline: 'a',
									classes: [item.value]
								});
							};
						}
					})
				};
			}
			if (Settings.shouldShowLinkTitle(editor.settings)) {
				linkTitleCtrl = {
					name: 'title',
					type: 'textbox',
					label: 'Title',
					value: data.title
				};
			}

			win = editor.windowManager.open({
				title: 'Insert link',
				data: data,
				body: [
					// Вставляем свой input с выбором файлов и компонентов
					{
						name: 'href',
						type: 'FileImagePicker',
						filetype: 'file',
						// size: 40,
						autofocus: true,
						label: 'Url',
						id: 'link-href',
						onchange: urlChange,
						onkeyup: updateText,
						onpaste: updateText,
						onbeforecall: onBeforeCall
					},
					// Вставляем свой input поиска
					{
						name: 'search',
						type: 'textbox',
						label: 'Search in Evo',
						id: 'link-search',
						onkeyup: updateSearchResult,
						onpaste: updateSearchResult
					},
					textListCtrl,
					linkTitleCtrl,
					buildAnchorListControl(data.href),
					linkListCtrl,
					relListCtrl,
					targetListCtrl,
					classListCtrl
				],
				onSubmit: function (e) {
					var assumeExternalTargets = Settings.assumeExternalTargets(editor.settings);
					var insertLink = Utils.link(editor, attachState);
					var removeLink = Utils.unlink(editor);
					var resultData = global$4.extend({}, data, e.data);
					var href = resultData.href;
					if (!href) {
						removeLink();
						return;
					}
					if (!onlyText || resultData.text === initialText) {
						delete resultData.text;
					}
					if (href.indexOf('@') > 0 && href.indexOf('//') === -1 && href.indexOf('mailto:') === -1) {
						delayedConfirm(editor, 'The URL you entered seems to be an email address. Do you want to add the required mailto: prefix?', function (state) {
							if (state) {
								resultData.href = 'mailto:' + href;
							}
							insertLink(resultData);
						});
						return;
					}
					if (assumeExternalTargets === true && !/^\w+:/i.test(href) || assumeExternalTargets === false && /^\s*www[\.|\d\.]/i.test(href)) {
						delayedConfirm(editor, 'The URL you entered seems to be an external link. Do you want to add the required http:// prefix?', function (state) {
							if (state) {
								resultData.href = 'http://' + href;
							}
							insertLink(resultData);
						});
						return;
					}
					insertLink(resultData);
				}
			});
			var input = document.querySelector('#link-search');
			var inputUrl = document.querySelector('#link-href-inp');
			// Получаем свойства CSS
			const {left, height} = getComputedStyle(input);
			// Конструируем блок с результатами
			var div = document.createElement('div');
			// Добавляем нужные классы
			div.classList.add('mce-abs-layout-item');
			div.classList.add('mce-textbox');
			div.classList.add('links-search');
			// Применяем стили
			div.style.left = `${left}`;
			div.style.top = `${height}`;
			div.style.width = (parseInt(input.offsetWidth) - 2) + 'px';
			div.style.zIndex = 1000;
			// Вставляем блок результатов после input
			input.parentNode.after(div);

		};
		var open$1 = function (editor) {
			createLinkList(editor, showDialog);
		};
		var Dialog = { open: open$1 };

		var getLink = function (editor, elm) {
			return editor.dom.getParent(elm, 'a[href]');
		};
		var getSelectedLink = function (editor) {
			return getLink(editor, editor.selection.getStart());
		};
		var getHref = function (elm) {
			var href = elm.getAttribute('data-mce-href');
			return href ? href : elm.getAttribute('href');
		};
		var isContextMenuVisible = function (editor) {
			var contextmenu = editor.plugins.contextmenu;
			return contextmenu ? contextmenu.isContextMenuVisible() : false;
		};
		var hasOnlyAltModifier = function (e) {
			return e.altKey === true && e.shiftKey === false && e.ctrlKey === false && e.metaKey === false;
		};
		var gotoLink = function (editor, a) {
			if (a) {
				var href = getHref(a);
				if (/^#/.test(href)) {
					var targetEl = editor.$(href);
					if (targetEl.length) {
						editor.selection.scrollIntoView(targetEl[0], true);
					}
				} else {
					OpenUrl.open(a.href);
				}
			}
		};
		var openDialog = function (editor) {
			return function () {
				Dialog.open(editor);
			};
		};
		var gotoSelectedLink = function (editor) {
			return function () {
				gotoLink(editor, getSelectedLink(editor));
			};
		};
		var leftClickedOnAHref = function (editor) {
			return function (elm) {
				var sel, rng, node;
				if (Settings.hasContextToolbar(editor.settings) && !isContextMenuVisible(editor) && Utils.isLink(elm)) {
					sel = editor.selection;
					rng = sel.getRng();
					node = rng.startContainer;
					if (node.nodeType === 3 && sel.isCollapsed() && rng.startOffset > 0 && rng.startOffset < node.data.length) {
						return true;
					}
				}
				return false;
			};
		};
		var setupGotoLinks = function (editor) {
			editor.on('click', function (e) {
				var link = getLink(editor, e.target);
				if (link && global$1.metaKeyPressed(e)) {
					e.preventDefault();
					gotoLink(editor, link);
				}
			});
			editor.on('keydown', function (e) {
				var link = getSelectedLink(editor);
				if (link && e.keyCode === 13 && hasOnlyAltModifier(e)) {
					e.preventDefault();
					gotoLink(editor, link);
				}
			});
		};
		var toggleActiveState = function (editor) {
			return function () {
				var self = this;
				editor.on('nodechange', function (e) {
					self.active(!editor.readonly && !!Utils.getAnchorElement(editor, e.element));
				});
			};
		};
		var toggleViewLinkState = function (editor) {
			return function () {
				var self = this;
				var toggleVisibility = function (e) {
					if (Utils.hasLinks(e.parents)) {
						self.show();
					} else {
						self.hide();
					}
				};
				if (!Utils.hasLinks(editor.dom.getParents(editor.selection.getStart()))) {
					self.hide();
				}
				editor.on('nodechange', toggleVisibility);
				self.on('remove', function () {
					editor.off('nodechange', toggleVisibility);
				});
			};
		};
		var Actions = {
			openDialog: openDialog,
			gotoSelectedLink: gotoSelectedLink,
			leftClickedOnAHref: leftClickedOnAHref,
			setupGotoLinks: setupGotoLinks,
			toggleActiveState: toggleActiveState,
			toggleViewLinkState: toggleViewLinkState
		};

		var register = function (editor) {
			editor.addCommand('mceLink', Actions.openDialog(editor));
		};
		var Commands = { register: register };

		var setup = function (editor) {
			editor.addShortcut('Meta+K', '', Actions.openDialog(editor));
		};
		var Keyboard = { setup: setup };

		var setupButtons = function (editor) {
			editor.addButton('link', {
				active: false,
				icon: 'link',
				tooltip: 'Insert/edit link',
				onclick: Actions.openDialog(editor),
				onpostrender: Actions.toggleActiveState(editor)
			});
			editor.addButton('unlink', {
				active: false,
				icon: 'unlink',
				tooltip: 'Remove link',
				onclick: Utils.unlink(editor),
				onpostrender: Actions.toggleActiveState(editor)
			});
			if (editor.addContextToolbar) {
				editor.addButton('openlink', {
					icon: 'newtab',
					tooltip: 'Open link',
					onclick: Actions.gotoSelectedLink(editor)
				});
			}
			var suffix = editor.settings.cache_suffix || "";
			// Добавить стили в dom с tinymce
			var doc = tinymce.DOM.doc;
			// Выберем все link и оифильтруем по id
			var arr = [...doc.querySelectorAll('link')].filter(x => x.id == 'modxlink-css');
			// Если массив пустой вставляем link
			if(!arr.length) {
				var url = urlPlugin + `css/main.min.css` + suffix;
				var linkElm = global$2.DOM.create('link', {
					id: 'modxlink-css',
					rel: 'stylesheet',
					href: url
				});
				doc.getElementsByTagName('head')[0].appendChild(linkElm);
			}
		};
		var setupMenuItems = function (editor) {
			editor.addMenuItem('openlink', {
				text: 'Open link',
				icon: 'newtab',
				onclick: Actions.gotoSelectedLink(editor),
				onPostRender: Actions.toggleViewLinkState(editor),
				prependToContext: true
			});
			editor.addMenuItem('link', {
				icon: 'link',
				text: 'Link',
				shortcut: 'Meta+K',
				onclick: Actions.openDialog(editor),
				stateSelector: 'a[href]',
				context: 'insert',
				prependToContext: true
			});
			editor.addMenuItem('unlink', {
				icon: 'unlink',
				text: 'Remove link',
				onclick: Utils.unlink(editor),
				stateSelector: 'a[href]'
			});
		};
		var setupContextToolbars = function (editor) {
			if (editor.addContextToolbar) {
				editor.addContextToolbar(Actions.leftClickedOnAHref(editor), 'openlink | link unlink');
			}
		};
		var Controls = {
			setupButtons: setupButtons,
			setupMenuItems: setupMenuItems,
			setupContextToolbars: setupContextToolbars
		};

		this.showDialog = showDialog;
		// Регистрируем свой компонент Input с выбором файлов и изображений
		tinymce.ui.Factory.add('FileImagePicker',tinymce.ui.ComboBox.extend({
			init: function(settings) {
				var self = this, editor = tinymce.activeEditor, editorSettings = editor.settings;
				var actionCallback, fileBrowserCallback, fileBrowserCallbackTypes;
				settings.spellcheck = false;
				fileBrowserCallbackTypes = editorSettings.file_picker_types || editorSettings.file_browser_callback_types;
				if (fileBrowserCallbackTypes) {
					fileBrowserCallbackTypes = global$4.makeMap(fileBrowserCallbackTypes, /[, ]/);
				}

				if (!fileBrowserCallbackTypes || fileBrowserCallbackTypes[settings.filetype]) {
					fileBrowserCallback = editorSettings.file_picker_callback;
					if (fileBrowserCallback && (!fileBrowserCallbackTypes || fileBrowserCallbackTypes[settings.filetype])) {
						actionCallback = function() {
							var meta = self.fire('beforecall').meta;
							meta = global$4.extend({filetype: self.settings.filetype}, meta);
							// file_picker_callback(callback, currentValue, metaData)
							fileBrowserCallback.call(
								editor,
								function(value, meta) {
									self.value(value).fire('change', {meta: meta});
								},
								self.value(),
								meta
							);
						};
					} else {
						// Legacy callback: file_picker_callback(id, currentValue, filetype, window)
						fileBrowserCallback = editorSettings.file_browser_callback;
						if (fileBrowserCallback && (!fileBrowserCallbackTypes || fileBrowserCallbackTypes[settings.filetype])) {
							actionCallback = function() {
								fileBrowserCallback(
									self.getEl('inp').id,
									self.value(),
									self.settings.filetype,
									window
								);
							};
						}
					}
				}

				if (actionCallback) {
					settings.icon = 'browse';
					settings.onaction = actionCallback;
				}

				self._super(settings);
				self.off('click').on('click', function(e){
					var elm = e.target, root = self.getEl();
					if (!self.$.contains(root, elm) && elm != root) {
						return;
					}

					while (elm && elm != root) {
						if (elm.id && elm.id.indexOf('-action') != -1) {
								if (elm.id === self._id + '-image-action') {
									self.settings.filetype = 'image';
								} else {
									self.settings.filetype = 'file';
								}
								self.fire('action');
						}
						elm = elm.parentNode;
					}
				});
			},
			renderHtml: function() {
				var self = this, id = self._id, settings = self.settings, prefix = self.classPrefix;
				var value = self.state.get('value') || '';
				var icon, text, openBtnHtml = '', extraAttrs = '';
				if ("spellcheck" in settings) {
					extraAttrs += ' spellcheck="' + settings.spellcheck + '"';
				}

				if (settings.maxLength) {
					extraAttrs += ' maxlength="' + settings.maxLength + '"';
				}

				if (settings.size) {
					extraAttrs += ' size="' + settings.size + '"';
				}

				if (settings.subtype) {
					extraAttrs += ' type="' + settings.subtype + '"';
				}

				if (self.disabled()) {
					extraAttrs += ' disabled="disabled"';
				}

				 openBtnHtml = (
						'<div id="' + id + '-open" class="' + prefix + 'btn ' + prefix + 'open" tabIndex="-1" role="button">' +
							'<button id="' + id + '-action" type="button" hidefocus="1" tabindex="-1">' +
								'<i class="mce-ico mce-i-browse"></i>' +
							'</button>' +
							'<button id="' + id + '-image-action" type="button" hidefocus="1" tabindex="-1">' +
								'<i class="mce-ico mce-i-image"></i>' +
							'</button>' +
						'</div>'
					);
					self.classes.add('has-open');

				return (
					'<div id="' + id + '" class="' + self.classes + '">' +
						'<input id="' + id + '-inp" class="' + prefix + 'textbox" value="' +
						self.encode(value, false) + '" hidefocus="1"' + extraAttrs + ' placeholder="' +
						self.encode(settings.placeholder) + '" />' +
						openBtnHtml +
					'</div>'
				);
			},
		}));

		global.add('modxlink', function (editor, urlpath) {
			// Получаем url плагина
			urlPlugin = urlpath +"/";
			Controls.setupButtons(editor);
			Controls.setupMenuItems(editor);
			Controls.setupContextToolbars(editor);
			Actions.setupGotoLinks(editor);
			Commands.register(editor);
			Keyboard.setup(editor);
		});

		function Plugin () {}

		return Plugin;

	}(window));
