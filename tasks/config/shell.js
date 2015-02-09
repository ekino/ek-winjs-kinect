module.exports = function (grunt) {

    grunt.config.set('shell', {
        build:{
            command: 'cordova build windows -- --win --release --archs="x64"' // Remove "windows -- --win" to build also for phone, replace arch by yours
        },
        run:{
            command: 'cordova run windows -- --win --debug --archs="x64"' // Remove "windows -- --win" to build also for phone, replace arch by yours
        }
    });

    grunt.loadNpmTasks('grunt-shell');
};