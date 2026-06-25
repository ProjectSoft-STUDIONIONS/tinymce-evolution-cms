/**
 * Task tinymce-evolution
 *
 * Задача сборки плагинов TinyMCE для EvolutionCMS
 *
 * Author: Чернышёв Андрей aka ProjectSoft <projectsoft2009@yandex.ru>
 *
 */
module.exports = function(grunt) {
	const chalk = require('chalk');
	const fs = require('fs');
	const path = require('path');
	const zl = require('zip-lib');
	const UglifyJS = require("uglify-js");
	const downloadNpmPackage = require('download-npm-package');
	// Длина левого сообщения ( Заголовок до знака -> )
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
			issues,
			pkgversion,
			lastupdate
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
					issues,
					pkgversion,
					lastupdate
				);
			} else {
				// Перезаписываем имена файлов тем
				let outFile = file.replace(/tinymce\d+/g, lowercase);
				fs.copyFileSync(source + '/' + file, target + '/' + outFile);
				// Перезапись данных в файле
				// ...
				// Открыть файл, перезаписать глобальные переменные
				// Определяем обрабатываемые файлы по расширениям
				let extArr = [
					".html",
					".php",
					".tpl"
				];
				let ext = path.extname(outFile).toLowerCase();
				// Скин директория TinyMCE4
				let skinsDirectory = 'tinymce/skins';
				if(extArr.includes(ext)) {
					// Получаем контент файла
					let content = fs.readFileSync(target + '/' + outFile, {encoding: 'utf8'});
					if(typeof version != 'undefined') {
						let num = version.split(".")[0];
						if (num > 4){
							// Скин директрия для версий выше 4-ой меняется
							skinsDirectory = 'tinymce/skins/ui';
						}
						// Перезапишем по паттернам
						content = content
							.replace(/%lowercase%/g, lowercase)
							.replace(/%uppercase%/g, uppercase)
							.replace(/%biguppercase%/g, biguppercase)
							.replace(/%version%/g, version)
							.replace(/%repository%/g, repository)
							.replace(/%issues%/g, issues)
							.replace(/%skinsDirectory%/g, skinsDirectory)
							.replace(/%pkgversion%/g, pkgversion)
							.replace(/%lastupdate%/g, lastupdate);
						// Запишем файл
						fs.writeFileSync(target + '/' + outFile, content, {encoding: 'utf8'});
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
			width = lineWidth - String(title).length,
			date = new Date(),
			hours = String(date.getHours()).padStart(2, "0"),
			minutes = String(date.getMinutes()).padStart(2, "0"),
			seconds = String(date.getSeconds()).padStart(2, "0"),
			milliseconds = String(date.getMilliseconds()).padStart(3, "0"),
			out_date = `${hours}:${minutes}:${seconds}.${milliseconds}`;
		switch (type) {
			case "warn":
				method = grunt.fail.warn;
				method("\n" + chalk.yellow(title) + String('-> ').padStart(width + 3) + chalk.yellowBright(out_date) + " " + chalk.redBright(description));
				break;
			case "fatal":
				method = grunt.fail.fatal;
				method("\n" + chalk.redBright(title) + String('-> ').padStart(width + 3) + chalk.yellowBright(out_date) + " " + chalk.redBright(description));
				break;
			case "start":
				method([chalk.yellowBright(title) + String('-> ').padStart(width) + chalk.yellowBright(out_date) + " " + chalk.greenBright(description)]);
				break;
			case "init":
				method([chalk.cyanBright(title) + String('-> ').padStart(width) + chalk.yellowBright(out_date) + " " + chalk.greenBright(description)]);
				break;
			case "success":
				method([chalk.magentaBright(title) + String('-> ').padStart(width) + chalk.yellowBright(out_date) + " " + chalk.greenBright(description)]);
				break;
			default:
				method([chalk.cyan(title) + String('-> ').padStart(width) + chalk.yellowBright(out_date) + " " + chalk.greenBright(description)]);
				break;
		}

	}

	const task = async function() {
		var options = this.options({
			directory: 'assets/plugins',
			src: 'src',
			repository: 'https://github.com/',
			issues: 'https://github.com/',
			install: 'install',
		});
		var pkgVersion = grunt.config.data.pkg.version;
		var linkVers = "https://registry.npmjs.org/tinymce?fields=dist-tags";
		var done = this.async();
		var val;
		var versions = {};
		let strWidth = 0;
		var date = new Date(),
			year = String(date.getFullYear()),
			month = String(date.getMonth() + 1).padStart(2, "0"),
			day = String(date.getDate()).padStart(2, "0"),
			lastupdate = `${year}-${month}-${day}`,
			readmedate = `${day}-${month}-${year}`;
		gruntLog('Download TinyMCE versions', linkVers, 'start');
		try {
			// Получаем свежие версии
			const response = await fetch(linkVers);
			if (!response.ok) {
				gruntLog('>> Error Download', 'Выявлена ошибка при выполнении сетевого запроса', 'warn');
			}
			let tempJson =  await response.json();
			let tempDistTags = tempJson["dist-tags"];
			delete tempDistTags.latest;
			let distTags = Object.assign({}, sortKeys(tempDistTags));
			// Нам просто придётся клонировать объект.
			distTags = JSON.parse(JSON.stringify(distTags));
			grunt.log.ok([JSON.stringify(distTags, null, 10)]);
			// Читаем данные
			versions = Object.values(distTags);
		}catch(error) {
			gruntLog('>> Error Download', 'Выявлена ошибка при выполнении сетевого запроса', 'fatal');
		}
		// Понеслась
		for (val of versions) {
			// Директория вывода
			let num = val.split(".")[0],
				packge = `tinymce@${val}`,
				lowercase = `tinymce${num}`,
				uppercase = `TinyMCE${num}`,
				biguppercase = `TINYMCE${num}`,
				pkg_version = `${val}-${pkgVersion}`,
				// Полный путь директории вывода
				dirOut = `dist/${lowercase}/${lowercase}/${options.directory}/${lowercase}`,
				installOut = `dist/${lowercase}/${lowercase}/install/` + options.directory,
				cacheOut = `cache/${packge}`;
			//if(parseInt(num) != 4){
			//	continue;
			//}
			grunt.log.ok([" "]);
			gruntLog('Initialize', packge, 'init');

			// Исходная директория языка
			let vn = Number(num) == 4 ? '' : num;
			let lngIn = 'node_modules/tinymce-i18n/langs' + vn;
			// Конечная директория языка
			let lngOut = cacheOut + '/tinymce/langs';

			if(!fs.existsSync(cacheOut)){
				// Скачать пакет, скопировать языки
				// Стартуем загрузку

				gruntLog('Start Download', `download npm package ${packge}`, 'init');
				await downloadNpmPackage({
					// Тег версии tinymce
					arg: packge,
					dir: cacheOut
				}).then((rel) => {
					// Удачная загрузка
					gruntLog('Success Download', packge, 'success');
					gruntLog('Unzipped', cacheOut, 'success');
					// Копируем с рекурсией языки
					fs.cpSync(lngIn, lngOut, {
						recursive: true,
						force: true
					});
					gruntLog('Copy languages ' + lowercase, lngOut, 'ok');
					// Удаление мобильной темы
					if(grunt.file.exists(cacheOut + '/tinymce/themes/mobile')) {
						grunt.file.delete(cacheOut + '/tinymce/themes/mobile');
						gruntLog('Delete mobile ' + lowercase, cacheOut + '/tinymce/themes/mobile', 'ok');
					}
				}).catch((err) => {
					// Ошибка загрузки
					// Сразу выходим
					gruntLog('>> Error Download', err, 'warn');
				});
			}

			// Вот здесь уже копирование всего в исходники плагинов
			// Копируем с рекурсией TinyMCE
			fs.cpSync(cacheOut, dirOut, {
				recursive: true,
				force: true
			});
			gruntLog('Copy source ' + lowercase, dirOut, 'ok');
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
				options.issues,
				pkg_version,
				lastupdate
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
				options.issues,
				pkg_version,
				lastupdate
			);
			gruntLog('Copy plugins ' + lowercase, dirOutPlgs, 'ok');

			// Минимизация плагинов и языков plugins${num}
			// Плагин modxlink перезапишется в версиях больше четвёртой версии
			grunt.file.recurse(`plugins${num}`, function(abspath, rootdir, subdir, filename){
				let out, script, result;
				if(filename=='plugin.js' || /langs$/.test(subdir)){
					out = `${dirOutPlgs}/${subdir}/` + (filename == 'plugin.js' ? `plugin.min.js` : `${filename}`);
					script = grunt.file.read(`${abspath}`).toString();
					// Если есть первый комментарий, то добавим в начало к минимизированному.
					const regex = /(\/\*([\s\S]*?)\*\/)/;
					let m, comment = "";
					if ((m = regex.exec(script)) !== null) {
						comment = `${m[1]}\n`;
					}
					result = UglifyJS.minify(script, {
						output: {
							ascii_only: true
						}
					});
					if (!result.error) {
						grunt.file.write(out, comment + result.code, {encoding: 'utf8'});
						gruntLog('Uglify js', out, 'ok');
					}else{
						console.log(result.error);
						gruntLog('Uglify js', out, 'fatal');
					}
				}
			});

			// Копирование js-cookie
			copyFolderRecursiveSync(
				'node_modules/js-cookie/dist',
				dirOut + "/js",
				lowercase,
				uppercase,
				biguppercase,
				val,
				options.repository,
				options.issues,
				pkg_version,
				lastupdate
			);
			gruntLog('Copy js-cookie', dirOut + "/js", 'ok');

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
				options.issues,
				pkg_version,
				lastupdate
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
				options.issues,
				pkg_version,
				lastupdate
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
					options.issues,
					pkg_version,
					lastupdate
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
					options.issues,
					pkg_version,
					lastupdate
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
				options.issues,
				pkg_version,
				lastupdate
			);
			gruntLog('Copy install ' + lowercase, installOut + '/' + lowercase + '.tpl', 'ok');

			// Архивирование
			gruntLog('Archiving', `tinymce-${num}.zip`, 'ok');
			const zip = new zl.Zip();
			zip.addFolder(`dist/${lowercase}`);
			await zip.archive(`tinymce-${num}.zip`);
			gruntLog('End of Archiving', `tinymce-${num}.zip`, 'ok');
		}

		// Readme
		/**/
		const regex = /\d{2}-\d{2}-\d{4}/;
		let readme = grunt.file.read("README.md").toString();
		let result = readme.replace(/\d{2}-\d{2}-\d{4}/, readmedate);
		grunt.file.write("README.md", result);
		/**/
		// Окончание работы задачи
		done();
	};

	grunt.registerMultiTask('tinymceevolution', 'TinyMCE for Evolution CMS', task);
	grunt.registerMultiTask('tinymce_evolution', 'TinyMCE for Evolution CMS', task);
	grunt.registerMultiTask('tinymce-evolution', 'TinyMCE for Evolution CMS', task);
}
