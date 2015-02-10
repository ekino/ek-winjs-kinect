module.exports = function (grunt) {

    grunt.config.set('concat', {
        dist: {
            src: [ '<%= config.src_dir %>/**/*.js' ],
            dest: '<%= config.build_dir %>/ek-winjs-kinect.js'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
};