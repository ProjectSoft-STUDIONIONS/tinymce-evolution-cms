module.exports = function(grunt) {
	const chalk = require('chalk');
	const fs = require('fs');
	const path = require('path');
	const downloadNpmPackage = require('download-npm-package');
	const lineWidth = 29;
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
					//console.log(version);
					if(typeof version != 'undefined') {
						let num = version.split(".")[0];
						//console.log(content);
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

	grunt.registerMultiTask('tinymce-evolution', 'TinyMCE for Evolution CMS',async function() {
		var options = this.options({
			versions: ["4.9.11"],
			directory: 'assets/plugins',
			src: 'src',
			repository: 'https://github.com/',
			issues: 'https://github.com/',
			install: 'install',
			plugins: 'plugins',
			plugins4: 'plugins4',
			plugins5: 'plugins5'
		});
		var done = this.async();
		var val;
		let strWidth = 0;
		for (val of options.versions) {
				// Директория вывода
			let num = val.split(".")[0],
				lowercase = `tinymce${num}`,
				uppercase = `TinyMCE${num}`,
				biguppercase = `TINYMCE${num}`,
				// Полный путь директории вывода
				dirOut = 'dist/' + options.directory + '/' + lowercase,
				installOut = 'dist/install/' + options.directory,
				cacheOut = 'cache/' + lowercase;
			// Исходная директория языка
			let lngIn = 'node_modules/tinymce-lang/langs';
			// Конечная директория языка
			let lngOut = cacheOut + '/tinymce/langs';
			//if(!grunt.file.exists(cacheOut)) {
				// grunt.file.mkdir(cacheOut, 0777);
				// Стартуем загрузку
				strWidth = lineWidth - String('Start Download').length;
				grunt.log.ok([chalk.cyanBright('Start Download') + String('-> ').padStart(strWidth) + chalk.greenBright(val)]);
				// Скачать пакет, скопировать языки
				await downloadNpmPackage({
					// Тег версии tinymce
					arg: `tinymce@${val}`,
					dir: cacheOut
				}).then((rel) => {
					// Удачная загрузка
					strWidth = lineWidth - String('Success Download').length;
					grunt.log.ok([chalk.magentaBright('Success Download') + String('-> ').padStart(strWidth) + chalk.greenBright(val)]);
					strWidth = lineWidth - String('Unzipped').length;
					grunt.log.ok([chalk.magentaBright('Unzipped') + String('-> ').padStart(strWidth) + chalk.greenBright(cacheOut)]);
				}).catch((err) => {
					// Ошибка загрузки
					// И сразу выходим
					strWidth = lineWidth - String('Error Download').length;
					grunt.fail.warn(chalk.redBright('Error Download') + String('-> ').padStart(strWidth) + chalk.redBright(err));
				});
				// Копируем с рекурсией языки
				fs.cpSync(lngIn, lngOut, {
					recursive: true,
					force: true
				});
				strWidth = lineWidth - String('Copy languages ' + lowercase).length;
				grunt.log.ok([chalk.cyan('Copy languages ' + lowercase) + String('-> ').padStart(strWidth) + chalk.greenBright(lngOut)]);
			//}
			// И вот здесь уже копирование всего в исходники плагинов
			// Копируем с рекурсией TinyMCE
			fs.cpSync(cacheOut, dirOut, {
				recursive: true,
				force: true
			});
			strWidth = lineWidth - String('Copy ' + lowercase).length;
			grunt.log.ok([chalk.cyan('Copy ' + lowercase) + String('-> ').padStart(strWidth) + chalk.greenBright(dirOut)]);
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

			var tmpFile;
			for(tmpFile of tempFiles) {
				if(grunt.file.exists(tmpFile)) {
					grunt.file.delete(tmpFile, {});
				}
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
			strWidth = lineWidth - String('Copy plugins').length;
			grunt.log.ok([chalk.cyan('Copy plugins') + String('-> ').padStart(strWidth) + chalk.greenBright(dirOutPlgs)]);

			// Копирование файлов из src директории
			let pathFiles = options.src;
			copyFolderRecursiveSync(
				pathFiles,
				dirOut,
				lowercase,
				uppercase,
				biguppercase,
				val,
				options.repository,
				options.issues
			);
			strWidth = lineWidth - String('Copy src ' + lowercase).length;
			grunt.log.ok([chalk.cyan('Copy src ' + lowercase) + String('-> ').padStart(strWidth) + chalk.greenBright(dirOut)]);

			if(num > 4) {
				// Копирование плагинов tinymce 5 и выше
				copyFolderRecursiveSync(
					'plugins5',
					dirOutPlgs,
					lowercase,
					uppercase,
					biguppercase,
					val,
					options.repository,
					options.issues
				);
				strWidth = lineWidth - String('Copy plugins ' + lowercase).length;
				grunt.log.ok([chalk.cyan('Copy plugins ' + lowercase) + String('-> ').padStart(strWidth) + chalk.greenBright(dirOutPlgs)]);
				// Копирование тем
				copyFolderRecursiveSync(
					'theme5',
					dirOut,
					lowercase,
					uppercase,
					biguppercase,
					val,
					options.repository,
					options.issues
				);
				strWidth = lineWidth - String('Copy theme ' + lowercase).length;
				grunt.log.ok([chalk.cyan('Copy theme ' + lowercase) + String('-> ').padStart(strWidth) + chalk.greenBright(dirOut)]);
				// Чуть-чуть тест
				pathFiles = options.src;
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
				// Копирование плагинов tinymce 4
				copyFolderRecursiveSync(
					'plugins4',
					dirOutPlgs,
					lowercase,
					uppercase,
					biguppercase,
					val,
					options.repository,
					options.issues
				);
				strWidth = lineWidth - String('Copy plugins ' + lowercase).length;
				grunt.log.ok([chalk.cyan('Copy plugins ' + lowercase) + String('-> ').padStart(strWidth) + chalk.greenBright(dirOutPlgs)]);
				// Копирование тем
				copyFolderRecursiveSync(
					'theme4',
					dirOut,
					lowercase,
					uppercase,
					biguppercase,
					val,
					options.repository,
					options.issues
				);
				strWidth = lineWidth - String('Copy theme ' + lowercase).length;
				grunt.log.ok([chalk.cyan('Copy theme ' + lowercase) + String('-> ').padStart(strWidth) + chalk.greenBright(dirOut)]);
				// Чуть-чуть тест
				pathFiles = options.src;
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
			strWidth = lineWidth - String('Copy install ' + lowercase).length;
			grunt.log.ok([chalk.cyan('Copy install ' + lowercase) + String('-> ').padStart(strWidth) + chalk.greenBright(installOut + '/' + lowercase + '.tpl')]);
		}

		// Копирование класса в lib
		copyFolderRecursiveSync('lib', 'dist/assets/lib');
		strWidth = lineWidth - String('Copy lib').length;
		grunt.log.ok([chalk.cyan('Copy lib') + String('-> ').padStart(strWidth) + chalk.greenBright('dist/assets/lib')]);
		// Окончание работы задач
		done();
	});
}
