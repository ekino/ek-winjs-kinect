module.exports = function (grunt) {

    grunt.config.set('copy', {
        images: {
            files: [
                {
                    expand: true,
                    cwd: '',
                    src: ['<%= config.samples_dir %>/**/*.js','<%= config.samples_dir %>/**/*.html','<%= config.samples_dir %>/**/*.{png,jpg,jpeg,gif,webp,svg}'],
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
                    cwd: '',
                    src: [ '<%= config.samples_dir %>/**/*.js' ],
                    dest: '<%= config.www_dir %>/'
                }
            ]
        },
        markup:{
            files: [
                {
                    expand: true,
                    cwd: '',
                    src: [ '<%= config.samples_dir %>/**/*.html' ],
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