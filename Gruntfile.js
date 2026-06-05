module.exports = function(grunt) {
	const fs = require('node:fs');
	const path = require('node:path');
	const chalk = require('chalk');

	// const { string: PluginString } = require('rollup-plugin-string');
	// const FilesAsStrings = PluginString({
	// 	include: '**/*.svg'
	// });

	// let gruntUtils = require('./tools/modules/grunt-utils');
	// let swag = require('@ephox/swag');
	// const nodeResolve = require('@rollup/plugin-node-resolve');
	// const alias = require('@rollup/plugin-alias');

	const PACK = grunt.file.readJSON('package.json');
	// Старт начинается с запуска в командной строке старта - npm run start
	// Только после получения последних версий можно запускать grunt
	const tinymcePack = grunt.file.readJSON('tinymce.json');

	let plugins = [
		'imagetools',
		'modxlink'
	];

	delete tinymcePack.latest;

	const VERSIONS = Object.values(tinymcePack);

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
				'dist/lib',
				'cache/*',
			]
		},
		'tinymce-evolution': {
			options: {
				versions: VERSIONS,
				directory: "assets/plugins",
				src: 'src',
				repository: PACK.homepage,
				issues: PACK.bugs.url,
				install: "install"
			},
			main: {},
		},
		rollup: Object.assign(
			{}
		),
		compress: {
			tinymce4: {
				options: {
					archive: `tinymce4-evocms.zip`,
				},
				files: [
					{
						expand: true,
						cwd: 'dist/assets/plugins/tinymce4',
						src: ['**'],
						dest: 'tinymce4-evocms/assets/plugins/tinymce4/'
					},
					{
						expand: true,
						cwd: 'dist/install/assets/plugins',
						src: ['tinymce4.tpl'],
						dest: 'tinymce4-evocms/install/assets/plugins/'
					},
					{
						expand: true,
						cwd: 'dist/assets/lib',
						src: ['**'],
						dest: 'tinymce4-evocms/assets/lib/'
					},
				],
			},
			tinymce5: {
				options: {
					archive: `tinymce5-evocms.zip`,
				},
				files: [
					{
						expand: true,
						cwd: 'dist/assets/plugins/tinymce5',
						src: ['**'],
						dest: 'tinymce5-evocms/assets/plugins/tinymce5/'
					},
					{
						expand: true,
						cwd: 'dist/install/assets/plugins',
						src: ['tinymce5.tpl'],
						dest: 'tinymce5-evocms/install/assets/plugins/'
					},
					{
						expand: true,
						cwd: 'dist/assets/lib',
						src: ['**'],
						dest: 'tinymce5-evocms/assets/lib/'
					},
				],
			},
			tinymce6: {
				options: {
					archive: `tinymce6-evocms.zip`,
				},
				files: [
					{
						expand: true,
						cwd: 'dist/assets/plugins/tinymce6',
						src: ['**'],
						dest: 'tinymce6-evocms/assets/plugins/tinymce6/'
					},
					{
						expand: true,
						cwd: 'dist/install/assets/plugins',
						src: ['tinymce6.tpl'],
						dest: 'tinymce6-evocms/install/assets/plugins/'
					},
					{
						expand: true,
						cwd: 'dist/assets/lib',
						src: ['**'],
						dest: 'tinymce6-evocms/assets/lib/'
					},
				],
			},
			tinymce7: {
				options: {
					archive: `tinymce7-evocms.zip`,
				},
				files: [
					{
						expand: true,
						cwd: 'dist/assets/plugins/tinymce7',
						src: ['**'],
						dest: 'tinymce7-evocms/assets/plugins/tinymce7/'
					},
					{
						expand: true,
						cwd: 'dist/install/assets/plugins',
						src: ['tinymce7.tpl'],
						dest: 'tinymce7-evocms/install/assets/plugins/'
					},
					{
						expand: true,
						cwd: 'dist/assets/lib',
						src: ['**'],
						dest: 'tinymce7-evocms/assets/lib/'
					},
				],
			},
			tinymce8: {
				options: {
					archive: `tinymce8-evocms.zip`,
				},
				files: [
					{
						expand: true,
						cwd: 'dist/assets/plugins/tinymce8',
						src: ['**'],
						dest: 'tinymce8-evocms/assets/plugins/tinymce8/'
					},
					{
						expand: true,
						cwd: 'dist/install/assets/plugins',
						src: ['tinymce8.tpl'],
						dest: 'tinymce8-evocms/install/assets/plugins/'
					},
					{
						expand: true,
						cwd: 'dist/assets/lib',
						src: ['**'],
						dest: 'tinymce8-evocms/assets/lib/'
					},
				],
			},
		},
	});
	grunt.registerTask('default',	['clean', 'tinymce-evolution', /* 'compress'*/]);
}
