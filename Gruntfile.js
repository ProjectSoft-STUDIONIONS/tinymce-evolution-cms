module.exports = async function(grunt) {
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
	// По умолчанию запуск задачи default
	grunt.registerTask('default',	['clean:main', 'tinymce-evolution']);
	// Отдельная задача запуска очистки директорий cache, dist и архивов.
	grunt.registerTask('cache',	['clean:cache']);
}
