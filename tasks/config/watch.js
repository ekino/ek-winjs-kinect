module.exports = function (grunt) {

    grunt.config.set('watch', {
        scripts: {
            files: [
                '<%= config.src_dir %>/**/*.js',
                '<%= config.samples_dir %>/**/*.js'
            ],
            tasks: ['copy:js']
        },
        sass: {
            files: [
                '<%= config.samples_dir %>/**/*.scss'
            ],
            tasks: ['sass']
        },
        markup: {
            files: [
                '<%= config.samples_dir %>/**/*.html'
            ],
            tasks: ['copy:markup']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
}