module.exports = function (grunt) {

    grunt.config.set('copy', {
        build: {
            files: [
                {
                    expand: true,
                    cwd: '<%= config.samples_dir %>',
                    src: ['**/*.js','**/*.html','**/*.{png,jpg,jpeg,gif,webp,svg}'],
                    dest: '<%= config.www_dir %>/'
                },
                {
                    expand: true,
                    cwd: '',
                    src: [ '<%= config.build_dir %>/**' ],
                    dest: '<%= config.www_dir %>/'
                },
                {
                    expand: true,
                    cwd: '',
                    src: [ '<%= config.bower_dir %>/**' ],
                    dest: '<%= config.www_dir %>/'
                },
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};