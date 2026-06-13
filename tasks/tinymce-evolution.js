module.exports = function(grunt) {
	const chalk = require('chalk');
	const fs = require('fs');
	const path = require('path');
	const zl = require('zip-lib');
	const downloadNpmPackage = require('download-npm-package');
	const lineWidth = 29;
	const copyReplceFiles = function(directory, mask) {
		//
	};
	const copyFolderRecursiveSync = function (
			source,
			target,
			lowercase,
			uppercase,
			biguppercase,
			version,
			repository,
			issues
	) {
		let files = [];

		// Проверяем, существует ли исходная директория
		if (!fs.existsSync(source)) {
			grunt.log.writeln(chalk.redBright("Директория не существует: ") + source);
			return;
		}

		// Убеждаемся, что целевая папка существует
		if (!fs.existsSync(target)) {
			fs.mkdirSync(target, {recursive: true});
		}

		// Получаем содержимое директории
		files = fs.readdirSync(source);

		files.forEach(function(file) {
			let current = fs.lstatSync(source + '/' + file);

			if (current.isDirectory()) {
				copyFolderRecursiveSync(
					source + '/' + file,
					target + '/' + file,
					lowercase,
					uppercase,
					biguppercase,
					version,
					repository,
					issues
				);
			} else {
				let outFile = file.replace(/tinymce\d+/g, lowercase);
				fs.copyFileSync(source + '/' + file, target + '/' + outFile);
				// grunt.verbose.ok(['Copy: ' + chalk.cyan(source + '/' + file) + " -> " + chalk.cyan(target + '/' + outFile)]);
				// Перезапись данных в файле
				// ...
				// Открыть файл, перезаписать по глобальным переменным
				// Определить расширение
				let extArr = [
					".html",
					".php",
					".tpl"
				];
				let ext = path.extname(outFile).toLowerCase();
				let skinsDirectory = 'tinymce/skins';
				if(extArr.includes(ext)) {
					let content = fs.readFileSync(target + '/' + outFile, {encoding: 'utf8'});
					if(typeof version != 'undefined') {
						let num = version.split(".")[0];
						if (num > 4){
							skinsDirectory = 'tinymce/skins/ui';
						}

						content = content
							.replace(/%lowercase%/g, lowercase)
							.replace(/%uppercase%/g, uppercase)
							.replace(/%biguppercase%/g, biguppercase)
							.replace(/%version%/g, version)
							.replace(/%repository%/g, repository)
							.replace(/%issues%/g, issues)
							.replace(/%skinsDirectory%/g, skinsDirectory);
						fs.writeFileSync(target + '/' + outFile, content, {encoding: 'utf8'});
						//grunt.verbose.ok(['Data replaced: ' + chalk.cyan(target + '/' + outFile)]);
					}
				}
			}
		});
	};

	const sortKeys = function(obj) {
		let keys = Object.keys(obj).sort((a, b) => {
				if (a < b) return -1;
				if (a > b) return 1;
				return 0;
			}),
			temp = {};
		keys.forEach(key => {
			temp[key] = obj[key];
		});
		return temp;
	}
	const gruntLog = function(title = '', description = '', type = 'ok') {
		let method = grunt.log.ok,
			width = lineWidth - String(title).length;
		switch (type) {
			case "warn":
				method = grunt.fail.warn;
				method("\n" + chalk.yellow(title) + String('-> ').padStart(width + 3) + chalk.redBright(description));
				break;
			case "fatal":
				method = grunt.fail.fatal;
				method("\n" + chalk.redBright(title) + String('-> ').padStart(width + 3) + chalk.redBright(description));
				break;
			case "init":
				method([chalk.cyanBright(title) + String('-> ').padStart(width) + chalk.greenBright(description)]);
				break;
			case "success":
				method([chalk.magentaBright(title) + String('-> ').padStart(width) + chalk.greenBright(description)]);
				break;
			default:
				method([chalk.cyan(title) + String('-> ').padStart(width) + chalk.greenBright(description)]);
				break;
		}

	}

	grunt.registerMultiTask('tinymce-evolution', 'TinyMCE for Evolution CMS',async function() {
		var options = this.options({
			directory: 'assets/plugins',
			src: 'src',
			repository: 'https://github.com/',
			issues: 'https://github.com/',
			install: 'install',
		});
		var done = this.async();
		var val;
		var versions = {};
		let strWidth = 0;
		try {
			// Получаем свежие версии
			const response = await fetch("https://registry.npmjs.org/tinymce?fields=dist-tags");
			if (!response.ok) {
				gruntLog('>> Error Download', 'Выявлена ошибка при выполнении сетевого запроса', 'warn');
			}
			let tempJson =  await response.json();
			let tempDistTags = tempJson["dist-tags"];
			delete tempDistTags.latest;
			let distTags = Object.assign({}, sortKeys(tempDistTags));
			// Пишем файл
			grunt.file.write("tinymce.json", JSON.stringify(distTags, null, "\t") + "\n");
			// Читаем файл
			versions = Object.values(grunt.file.readJSON("tinymce.json"));
			// Удаляем файл
			grunt.file.delete("tinymce.json");
		}catch(error) {
			gruntLog('>> Error Download', 'Выявлена ошибка при выполнении сетевого запроса', 'fatal');
		}

		// Понеслась
		for (val of versions) {
			// Директория вывода
			let num = val.split(".")[0],
				lowercase = `tinymce${num}`,
				uppercase = `TinyMCE${num}`,
				biguppercase = `TINYMCE${num}`,
				// Полный путь директории вывода
				dirOut = `dist/${lowercase}/${lowercase}/${options.directory}/${lowercase}`,
				installOut = `dist/${lowercase}/${lowercase}/install/` + options.directory,
				cacheOut = `cache/${lowercase}`;
			gruntLog('Initialize', val, 'init');

			// Исходная директория языка
			let vn = Number(num) == 4 ? '' : num;
			let lngIn = 'node_modules/tinymce-i18n/langs' + vn;
			// Конечная директория языка
			let lngOut = cacheOut + '/tinymce/langs';

			// Подготовим плагины
			// Перезапишем минификацию
			grunt.file.expandMapping(
				[`plugins${num}/**/plugin.js`],
				`plugins${num}`,
				{
					flatten: false,
					rename: function(destBase, destPath) {
						let inF = destPath;
						let outF = destPath.replace('plugin.js', 'plugin.min.js');
						fs.copyFileSync(inF, outF);
						return destPath.replace('plugin.js', 'plugin.min.js');
					}
				}
			);

			if(!fs.existsSync(cacheOut)){
				// Скачать пакет, скопировать языки
				// Стартуем загрузку

				gruntLog('Start Download', val, 'init');
				await downloadNpmPackage({
					// Тег версии tinymce
					arg: `tinymce@${val}`,
					dir: cacheOut
				}).then((rel) => {
					// Удачная загрузка
					gruntLog('Success Download', val, 'success');
					gruntLog('Unzipped', cacheOut, 'success');
					// Копируем с рекурсией языки
					fs.cpSync(lngIn, lngOut, {
						recursive: true,
						force: true
					});
					gruntLog('Copy languages ' + lowercase, lngOut, 'ok');
				}).catch((err) => {
					// Ошибка загрузки
					// Сразу выходим
					gruntLog('>> Error Download', err, 'warn');
				});
			}
			// Копируем с рекурсией языки
			fs.cpSync(lngIn, lngOut, {
				recursive: true,
				force: true
			});
			gruntLog('Copy languages ' + lowercase, lngOut, 'ok');

			// Вот здесь уже копирование всего в исходники плагинов
			// Копируем с рекурсией TinyMCE
			fs.cpSync(cacheOut, dirOut, {
				recursive: true,
				force: true
			});
			gruntLog('Copy ' + lowercase, dirOut, 'ok');
			// Удаляем ненужные файлы
			let tempFiles = [
				path.join(dirOut, 'tinymce', "bower.json"),
				path.join(dirOut, 'tinymce', "changelog.txt"),
				path.join(dirOut, 'tinymce', "CHANGELOG.md"),
				path.join(dirOut, 'tinymce', "composer.json"),
				path.join(dirOut, 'tinymce', "notices.txt"),
				path.join(dirOut, 'tinymce', "package.json"),
				path.join(dirOut, 'tinymce', "readme.md"),
			];
			//var tmpFile;
			for(var tmpFile of tempFiles) {
				if(grunt.file.exists(tmpFile)) {
					grunt.file.delete(tmpFile, {});
				}
			}
			// Подготовка плагинов
			if(num > 7) {
				copyReplceFiles();
			}
			// Далее
			// Копирование общих плагинов
			let dirOutPlgs = dirOut + '/tinymce/plugins';
			copyFolderRecursiveSync(
				'plugins',
				dirOutPlgs,
				lowercase,
				uppercase,
				biguppercase,
				val,
				options.repository,
				options.issues
			);
			gruntLog('Copy plugins', dirOutPlgs, 'ok');

			// Копирование плагинов
			copyFolderRecursiveSync(
				`plugins${num}`,
				dirOutPlgs,
				lowercase,
				uppercase,
				biguppercase,
				val,
				options.repository,
				options.issues
			);
			gruntLog('Copy plugins ' + lowercase, dirOutPlgs, 'ok');

			// Копирование файлов из src директории
			let pathFiles = options.src;
			copyFolderRecursiveSync(
				options.src,
				dirOut,
				lowercase,
				uppercase,
				biguppercase,
				val,
				options.repository,
				options.issues
			);
			gruntLog('Copy src ' + lowercase, dirOut, 'ok');

			// Копирование тем
			copyFolderRecursiveSync(
				`theme${num}`,
				dirOut,
				lowercase,
				uppercase,
				biguppercase,
				val,
				options.repository,
				options.issues
			);
			gruntLog('Copy theme ' + lowercase, dirOut, 'ok');

			if(num > 4) {
				// Файлы подключения плагина
				copyFolderRecursiveSync(
					'src_plugin5',
					dirOut,
					lowercase,
					uppercase,
					biguppercase,
					val,
					options.repository,
					options.issues
				);
			} else {
				// Файлы подключения плагина
				copyFolderRecursiveSync(
					'src_plugin4',
					dirOut,
					lowercase,
					uppercase,
					biguppercase,
					val,
					options.repository,
					options.issues
				);
			}

			// Копирование основного класса в lib
			copyFolderRecursiveSync('lib', `dist/${lowercase}/${lowercase}/assets/lib`);
			gruntLog('Copy lib', `dist/${lowercase}/${lowercase}/assets/lib`, 'ok');

			// Копирование инсталяционного файла плагина
			copyFolderRecursiveSync(
				options.install,
				installOut,
				lowercase,
				uppercase,
				biguppercase,
				val,
				options.repository,
				options.issues
			);
			gruntLog('Copy install ' + lowercase, installOut + '/' + lowercase + '.tpl', 'ok');
			gruntLog('Archiving', `tinymce_${val}.zip`, 'ok');
			const zip = new zl.Zip();
			zip.addFolder(`dist/${lowercase}`);
			await zip.archive(`tinymce_${val}.zip`);
			gruntLog('End of Archiving', `tinymce_${val}.zip`, 'ok');
			gruntLog('Archiving', `tinymce-${num}.zip`, 'ok');
			await zip.archive(`tinymce-${num}.zip`);
			gruntLog('End of Archiving', `tinymce-${num}.zip`, 'ok');
		}

		// Окончание работы задач
		done();
	});
}
