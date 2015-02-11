module.exports = function (grunt) {

    grunt.config.set('copy', {
        images: {
            files: [
                {
                    expand: true,
                    cwd: '<%= config.samples_dir %>',
                    src: ['**/*.js','**/*.html','**/*.{png,jpg,jpeg,gif,webp,svg}'],
                    dest: '<%= config.www_dir %>/'
                }
            ]
        },
        build:{
            files: [
                {
                    expand: true,
                    cwd: '',
                    src: [ '<%= config.build_dir %>/**/*.js' ],
                    dest: '<%= config.www_dir %>/'
                }
            ]
        },
        js:{
            files: [
                {
                    expand: true,
                    cwd: '<%= config.samples_dir %>',
                    src: [ '**/*.js' ],
                    dest: '<%= config.www_dir %>/'
                }
            ]
        },
        markup:{
            files: [
                {
                    expand: true,
                    cwd: '<%= config.samples_dir %>',
                    src: [ '**/*.html' ],
                    dest: '<%= config.www_dir %>'
                }
            ]
        },
        bower:{
            files: [
                {
                    expand: true,
                    cwd: '',
                    src: [ '<%= config.bower_dir %>/**' ],
                    dest: '<%= config.www_dir %>/'
                }
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};