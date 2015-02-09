module.exports = function (grunt) {

    grunt.config.set('clean', {
        build :{
            src:['<%= config.www_dir %>']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
};