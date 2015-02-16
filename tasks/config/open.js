module.exports = function (grunt) {

    grunt.config.set('open', {

        dev: {
            path: 'http://localhost:<%= express.options.port %>/examples'
        }

    });

    grunt.loadNpmTasks('grunt-open');
};