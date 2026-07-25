module.exports = async function(grunt) {
	//process.removeAllListeners('warning');

	const PACK = grunt.file.readJSON('package.json');

	require('time-grunt')(grunt);

	require('load-grunt-tasks')(grunt);
	grunt.loadTasks('tasks');

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
						dest: '../../OSPanel/home/example.local/assets',
					},
					{
						expand: true,
						cwd: 'dist/tinymce5/tinymce5/assets',
						src: '**',
						dest: '../../OSPanel/home/example.local/assets',
					},
					{
						expand: true,
						cwd: 'dist/tinymce6/tinymce6/assets',
						src: '**',
						dest: '../../OSPanel/home/example.local/assets',
					},
					{
						expand: true,
						cwd: 'dist/tinymce7/tinymce7/assets',
						src: '**',
						dest: '../../OSPanel/home/example.local/assets',
					},
					{
						expand: true,
						cwd: 'dist/tinymce8/tinymce8/assets',
						src: '**',
						dest: '../../OSPanel/home/example.local/assets',
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
	require('dotenv').config(
		{
			path: '.env',
			debug: true
		}
	);

	const isProduction = ['true', '1', 'yes'].includes(String(process.env.PRODUCTION).trim().toLowerCase());

	// По умолчанию запуск задачи default
	if(isProduction) {
		defaultTasks.push('copy');
	}

	grunt.registerTask('default', defaultTasks);
	// Отдельная задача запуска очистки директорий cache, dist и архивов.
	grunt.registerTask('cache',	['clean:cache']);
}
