module.exports = function (grunt) {



    grunt.registerTask('default', [
        'serve'
    ]);


    grunt.registerTask('build', [
        'clean:build',
        'sass',
        'copy',
        'wiredep',
        'concat',
        'uglify'
    ]);


};
