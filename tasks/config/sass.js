module.exports = function (grunt) {

    grunt.config.set('sass', {

        build: {
            options:{
                lineNumbers:true,
                loadPath: ['<%= config.samples_dir %>/']
            },
            files: [{
                expand: true,
                cwd: '<%= config.samples_dir %>',
                src: ['**/*.scss'],
                dest: '<%= config.www_dir %>/',
                ext: '.css'
            }]
        }

    });

    grunt.loadNpmTasks('grunt-contrib-sass');
};