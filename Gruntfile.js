(function () {
    'use strict';
    var path = require('path');
    module.exports = function (grunt) {
        // load all grunt tasks
        require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

        /**
         * Load in our build configuration file.
         */
        var userConfig = require('./build.config.js');

        var taskConfig = {
            jshint: {
                gruntfile: ['Gruntfile.js'],
                files: ['<%= src_dir %>/**/*.js'],
                options: {
                    // options here to override JSHint defaults
                    globals: {
                        console: true,
                        module: true
                    }
                }
            },
            watchfiles: {
                all: [
                    '<%= src_dir %>/{,*/}*.html',
                    '<%= src_dir %>/js/{,*/,*/}*.js',
                    '<%= src_dir %>/css/{,*/}*.css',
                    '<%= src_dir %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            sass: {
                build: {
                    options:{
                        lineNumbers:true,
                        loadPath: ['src/']
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= src_dir %>',
                        src: ['**/*.scss'],
                        dest: '<%= build_dir %>/',
                        ext: '.css'
                    }]
                }
            },
            watch: {
                scripts: {
                    files: [
                        's<%= src_dir %>rc/js/**/*.js',
                        '<%= src_dir %>/css/**/*.css'
                    ],
                    tasks: ['jshint']
                }
            },
            /**
             * Copy files
             */
            copy: {
                build:{
                    files: [
                        {
                            expand: true,
                            cwd: '<%= src_dir %>',
                            src: ['*.*'],
                            dest: '<%= build_dir %>/'
                        },
                        {
                            expand: true,
                            cwd: '<%= src_dir %>',
                            src: [ '<%= app.img %>' ],
                            dest: '<%= build_dir %>/'
                        },
                        {
                            expand: true,
                            cwd: '<%= src_dir %>',
                            src: [ '<%= app.js %>' ],
                            dest: '<%= build_dir %>/'
                        },
                    ]
                },
                www:{
                    files: [
                        {
                            expand: true,
                            cwd: '<%= build_dir %>',
                            src: ['**'],
                            dest: '<%= www_dir %>/'
                        },
                    ]
                },
            },
            shell: {
                build:{
                    command: 'cordova build windows -- --win --release --archs="x64"' // Remove "windows -- --win" to build also for phone, replace arch by yours
                },
                run:{
                    command: 'cordova run windows -- --win --debug --archs="x64"' // Remove "windows -- --win" to build also for phone, replace arch by yours
                }

            },
            clean:{
                build :{
                    src:['build']
                },
                www:{
                    src:['www']
                }
            },


             /**
             * Launch a local server. Use --livereload to refresh page automaticaly.
             */
            express: {
                options: {
                    port: 9000,
                    hostname: '*',
                    server: path.resolve('express.config.js')
                },
                build: {
                    options: {
                        bases: [
                            path.resolve('./www')
                        ],
                        livereload: grunt.option('livereload')
                    }
                }
            },

            /**
             * Open favorite browser at a specific url
             */
            open: {
                dev: {
                    path: 'http://localhost:<%= express.options.port %>/'
                }
            },
        }
        grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

        /**
         * Process files
         */
        grunt.registerTask('build', [
            'sass',
            'copy:build',
            'copy:www',
            'clean:build'
        ]);

         /**
         * Launch local server
         */
        grunt.registerTask('server', [
            'build',
            'express',
            'open',
            'watch'
        ]);

        grunt.registerTask('build-win8', function(){
           grunt.task.run(['build','shell:build']);
        });

        grunt.registerTask('default', ['server']);
    };
}());