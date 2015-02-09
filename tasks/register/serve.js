module.exports = function (grunt) {
    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            console.log('dist serve');
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'build',
            'express:serve',
            'open',
            'watch'
        ]);

    });
};
