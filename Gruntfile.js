module.exports = async function(grunt) {
	"use strict";
	process.removeAllListeners('warning');

	const PACK = grunt.file.readJSON('package.json');

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);
	grunt.loadTasks('tasks');

	const envObject = {},
		toBool = (val) => {
			if (!val) return false;
			const v = String(val).trim().toLowerCase();
			return ['true', '1', 'yes'].includes(v);
		},
		getAssetMode = (val) => {
			if (val === undefined || val === null) return 'test';
			const trimmed = String(val).trim();
			return trimmed ? trimmed.toLowerCase() : 'test';
		};

	require('dotenv').config({ processEnv: envObject });

	const PRODUCTION = toBool(envObject.PRODUCTION);
	const PRODUCTION_ASSETS = getAssetMode(envObject.PRODUCTION_ASSETS);

	grunt.initConfig({
		globalConfig : {},
		pkg : PACK,
		clean: {
			// Удаляем архивы и чистим директорию dist от TinyMCE
			main: [
				'./*.zip',
				'./dist/tinymce*',
			],
			// Удаляем архивы и чистим директорию dist, cache от TinyMCE
			cache: [
				'./*.zip',
				'./dist/tinymce*',
				'./cache/tinymce*',
			]
		},

		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'dist/tinymce4/tinymce4/assets',
						src: '**',
						dest: PRODUCTION_ASSETS,
					},
					{
						expand: true,
						cwd: 'dist/tinymce5/tinymce5/assets',
						src: '**',
						dest: PRODUCTION_ASSETS,
					},
					{
						expand: true,
						cwd: 'dist/tinymce6/tinymce6/assets',
						src: '**',
						dest: PRODUCTION_ASSETS,
					},
					{
						expand: true,
						cwd: 'dist/tinymce7/tinymce7/assets',
						src: '**',
						dest: PRODUCTION_ASSETS,
					},
					{
						expand: true,
						cwd: 'dist/tinymce8/tinymce8/assets',
						src: '**',
						dest: PRODUCTION_ASSETS,
					},
				],
			},
		},

		// Собираем плагины TinyMCE
		'tinymce-evolution': {
			options: {
				src: 'src',
				repository: PACK.homepage,
				issues: PACK.bugs.url
			},
			main: {},
		},
	});

	var defaultTasks = ['clean:main', 'tinymce-evolution'];

	// По умолчанию запуск задачи default
	if(PRODUCTION) {
		defaultTasks.push('copy');
	}

	grunt.registerTask('default', defaultTasks);
	// Отдельная задача запуска очистки директорий cache, dist и архивов.
	grunt.registerTask('cache',	['clean:cache']);
}
