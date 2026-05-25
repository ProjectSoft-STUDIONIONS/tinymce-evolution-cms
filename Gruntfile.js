module.exports = function(grunt) {
	const fs = require('node:fs');
	const path = require('node:path');
	const chalk = require('chalk');
	const PACK = grunt.file.readJSON('package.json');
	// По самой последней основной версии
	const VERSIONS = [
		"4.9.11",
		"5.10.9",
		"6.8.6",
		"7.9.2",
		"8.5.0",
	];
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);
	grunt.loadTasks('tasks');
	grunt.initConfig({
		globalConfig : {},
		pkg : {},
		clean: {
			main: [
				'./*.zip',
				'dist/assets',
				'dist/install',
				'dist/lib'
			]
		},
		uglify: {
			options: {
				sourceMap: false,
				compress: {
					drop_console: false,
				},
				output: {
					ascii_only: true,
				},
			},
			main: {
				files: [
					{
						expand: true,
						cwd: 'src/tinymce/plugins',
						src: '**/plugin.js',
						dest: 'src/tinymce/plugins',
						filter: 'isFile',
						rename: function (dst, src) {
							let nFile = dst + '/' + src.replace('.js', '.min.js');
							return nFile;
						},
					},
					{
						expand: true,
						cwd: 'plugins4',
						src: '**/plugin.js',
						dest: 'plugins4',
						filter: 'isFile',
						rename: function (dst, src) {
							let nFile = dst + '/' + src.replace('.js', '.min.js');
							return nFile;
						},
					},
					{
						expand: true,
						cwd: 'plugins5',
						src: '**/plugin.js',
						dest: 'plugins5',
						filter: 'isFile',
						rename: function (dst, src) {
							let nFile = dst + '/' + src.replace('.js', '.min.js');
							return nFile;
						},
					},
				],
			},
		},
		'tinymce-install': {
			options: {
				versions: VERSIONS,
				directory: "assets/plugins",
				src: 'src',
				plugins: 'plugins',
				plugins4: 'plugins4',
				plugins5: 'plugins5',
				repository: PACK.homepage,
				install: "install",
				issues: PACK.bugs.url
			},
			main: {},
		},
		compress: {
			tinymce4: {
				options: {
					archive: `tinymce4-plugin.zip`,
				},
				files: [
					{
						expand: true,
						cwd: 'dist/assets/plugins/tinymce4',
						src: ['**'],
						dest: 'tinymce4-plugin/assets/plugins/tinymce4/'
					},
					{
						expand: true,
						cwd: 'dist/install/assets/plugins',
						src: ['tinymce4.tpl'],
						dest: 'tinymce4-plugin/install/assets/plugins/'
					},
					{
						expand: true,
						cwd: 'dist/assets/lib',
						src: ['**'],
						dest: 'tinymce4-plugin/assets/lib/'
					},
				],
			},
			tinymce5: {
				options: {
					archive: `tinymce5-plugin.zip`,
				},
				files: [
					{
						expand: true,
						cwd: 'dist/assets/plugins/tinymce5',
						src: ['**'],
						dest: 'tinymce5-plugin/assets/plugins/tinymce5/'
					},
					{
						expand: true,
						cwd: 'dist/install/assets/plugins',
						src: ['tinymce5.tpl'],
						dest: 'tinymce5-plugin/install/assets/plugins/'
					},
					{
						expand: true,
						cwd: 'dist/assets/lib',
						src: ['**'],
						dest: 'tinymce5-plugin/assets/lib/'
					},
				],
			},
			tinymce6: {
				options: {
					archive: `tinymce6-plugin.zip`,
				},
				files: [
					{
						expand: true,
						cwd: 'dist/assets/plugins/tinymce6',
						src: ['**'],
						dest: 'tinymce6-plugin/assets/plugins/tinymce6/'
					},
					{
						expand: true,
						cwd: 'dist/install/assets/plugins',
						src: ['tinymce6.tpl'],
						dest: 'tinymce6-plugin/install/assets/plugins/'
					},
					{
						expand: true,
						cwd: 'dist/assets/lib',
						src: ['**'],
						dest: 'tinymce6-plugin/assets/lib/'
					},
				],
			},
			tinymce7: {
				options: {
					archive: `tinymce7-plugin.zip`,
				},
				files: [
					{
						expand: true,
						cwd: 'dist/assets/plugins/tinymce7',
						src: ['**'],
						dest: 'tinymce7-plugin/assets/plugins/tinymce7/'
					},
					{
						expand: true,
						cwd: 'dist/install/assets/plugins',
						src: ['tinymce7.tpl'],
						dest: 'tinymce7-plugin/install/assets/plugins/'
					},
					{
						expand: true,
						cwd: 'dist/assets/lib',
						src: ['**'],
						dest: 'tinymce7-plugin/assets/lib/'
					},
				],
			},
			tinymce8: {
				options: {
					archive: `tinymce8-plugin.zip`,
				},
				files: [
					{
						expand: true,
						cwd: 'dist/assets/plugins/tinymce8',
						src: ['**'],
						dest: 'tinymce8-plugin/assets/plugins/tinymce8/'
					},
					{
						expand: true,
						cwd: 'dist/install/assets/plugins',
						src: ['tinymce8.tpl'],
						dest: 'tinymce8-plugin/install/assets/plugins/'
					},
					{
						expand: true,
						cwd: 'dist/assets/lib',
						src: ['**'],
						dest: 'tinymce8-plugin/assets/lib/'
					},
				],
			},
		},
	});
	grunt.registerTask('default',	['clean', 'uglify', 'tinymce-install'/*, 'compress'*/]);
	grunt.registerTask('speed',	['clean', 'uglify', 'tinymce-install'/*, 'compress'*/]);
}
