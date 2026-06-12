module.exports = async function(grunt) {
	const fs = require('node:fs');
	const path = require('node:path');
	const chalk = require('chalk');

	const PACK = grunt.file.readJSON('package.json');

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);
	grunt.loadTasks('tasks');
	grunt.initConfig({
		globalConfig : {},
		pkg : {},
		clean: {
			main: [
				'./*.zip'
			]
		},
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
