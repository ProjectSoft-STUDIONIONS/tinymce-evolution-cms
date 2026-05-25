module.exports = function(grunt) {
	const chalk = require('chalk');
	const fs = require('fs');
	const path = require('path');
	const downloadNpmPackage = require('download-npm-package');
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
				grunt.verbose.ok(['Copy: ' + chalk.cyan(source + '/' + file) + " -> " + chalk.cyan(target + '/' + outFile)]);
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
						grunt.verbose.ok(['Data replaced: ' + chalk.cyan(target + '/' + outFile)]);
					}
				}
			}
		});
	};

	grunt.registerMultiTask('tinymce-install', 'TinyMCE install versions',async function() {
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
		for (val of options.versions) {
				// Директория вывода
			let num = val.split(".")[0],
				lowercase = `tinymce${num}`,
				uppercase = `TinyMCE${num}`,
				biguppercase = `TINYMCE${num}`,
				// Полный путь директории вывода
				dirOut = 'dist/' + options.directory + '/' + lowercase,
				installOut = 'dist/install/' + options.directory;
			//if(!fs.existsSync(installOut)) {
			//	fs.mkdirSync(installOut, {recursive: true});
			//}
			// Стартуем загрузку
			grunt.log.ok([chalk.cyanBright('Start Download') + '   -> ' + val])
			await downloadNpmPackage({
				// Тег версии tinymce
				arg: `tinymce@${val}`,
				dir: dirOut
			}).then((rel) => {
				// Удачная загрузка
				grunt.log.ok([chalk.magentaBright('Success Download') + ' -> ' + dirOut]);
				// Исходная директория языка
				let lngIn = 'node_modules/tinymce-lang/langs';
				// Конечная директория языка
				let lngOut = dirOut + '/tinymce/langs';
				// Копируем с рекурсией языки
				fs.cpSync(lngIn, lngOut, {
					recursive: true,
					force: true
				});
				let dirInpPlgs = options.plugins,
					dirOutPlgs = dirOut + '/tinymce/plugins';

				// Копирование общих плагинов
				copyFolderRecursiveSync(
					dirInpPlgs,
					dirOutPlgs,
					lowercase,
					uppercase,
					biguppercase,
					val,
					options.repository,
					options.issues
				);

				if(num > 4) {
					// Копирование плагинов tinymce 5 и выше
					dirInpPlgs = options.plugins5;
					copyFolderRecursiveSync(
						dirInpPlgs,
						dirOutPlgs,
						lowercase,
						uppercase,
						biguppercase,
						val,
						options.repository,
						options.issues
					);
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
				} else {
					// Копирование плагинов tinymce 4
					dirInpPlgs = options.plugins4;
					copyFolderRecursiveSync(
						dirInpPlgs,
						dirOutPlgs,
						lowercase,
						uppercase,
						biguppercase,
						val,
						options.repository,
						options.issues
					);
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
				}

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
				
				// Копирование инсталяционного файла
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

				// Завершение загрузки
				grunt.log.ok([chalk.yellowBright('Done ' + lowercase) + '    -> ' + lngOut]);
			}).catch((err) => {
				// Ошибка загрузки
				grunt.log.error([chalk.redBright('Error Download') + '   -> ' + err]);
				done();
			});
		}
		// Копирование класса в lib
		copyFolderRecursiveSync('lib', 'dist/assets/lib');

		// Окончание работы плагина
		done();
	});
}
