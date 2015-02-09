module.exports = function (grunt) {


    grunt.registerTask('build-win8', function(){
        grunt.task.run(['build','shell:build']);
    });


};
