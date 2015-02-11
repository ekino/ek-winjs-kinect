module.exports = function (grunt) {

    grunt.config.set('watch', {
        scripts: {
            files: [
                '<%= config.samples_dir %>/**/*.js'
            ],
            tasks: ['copy:js']
        },
        src: {
            files: [
                '<%= config.src_dir %>/**/*.js',
            ],
            tasks: ['concat','uglify','copy:build']
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