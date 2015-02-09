module.exports = function (grunt) {

    grunt.config.set('watch', {
        scripts: {
            files: [
                '<%= config.src_dir %>/**/*.js',
                '<%= config.samples_dir %>/**/*.js',
                '<%= config.samples_dir %>/**/*.html',
                '<%= config.samples_dir %>/**/*.scss'
            ],
            tasks: ['build']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
}