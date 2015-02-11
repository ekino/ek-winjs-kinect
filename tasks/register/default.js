module.exports = function (grunt) {



    grunt.registerTask('default', [
        'serve'
    ]);


    grunt.registerTask('build', [
        'clean',
        'sass',
        'copy',
        'wiredep',
        'concat',
        'uglify'
    ]);


};
