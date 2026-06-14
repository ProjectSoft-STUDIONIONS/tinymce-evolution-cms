module.exports = async function(grunt) {
	const PACK = grunt.file.readJSON('package.json');

	require('time-grunt')(grunt);

	require('load-grunt-tasks')(grunt);
	grunt.loadTasks('tasks');

	grunt.initConfig({
		globalConfig : {},
		pkg : {},
		// Удаляем архивы и чистим директорию dist от TinyMCE
		clean: {
			main: [
				'./*.zip',
				'./dist/tinymce*',
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
	grunt.registerTask('default',	['clean', 'tinymce-evolution']);
}
