module.exports = function (grunt) {

    grunt.config.set('uglify', {
        my_target: {
            files: {
                '<%= config.build_dir %>/ek-winjs-kinect.min.js': ['<%= config.build_dir %>/ek-winjs-kinect.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
};