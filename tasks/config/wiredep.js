module.exports = function (grunt) {

    grunt.config.set('wiredep', {
        app: {
            src: ['<%= config.samples_dir %>/**/*.html']
        }
    });

    grunt.loadNpmTasks('grunt-wiredep');
};