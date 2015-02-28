
module.exports = function (grunt) {


    grunt.config.set('karma', {
        unit: {
            configFile: './tasks/module/karma.config.js',
            singleRun: true
        }/*,
        release: {
            configFile: './tasks/module/karma.config.js',
            reporters: ['junit', 'coverage'],
            singleRun: true
        }*/
    });


    grunt.loadNpmTasks('grunt-karma');

}