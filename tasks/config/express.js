/**
 * Created by mickael on 06/11/14.
 */
module.exports = function (grunt) {
    var  path = require("path");
    var config = require('../config.js');
    var port = 9000;

    grunt.config.set('express', {
        options: {
            port: port,
            hostname: '*',
            server: path.resolve("./tasks/server/server.js")
        },
        livereload: {
            options: {
                livereload: true,
                serverreload: false,
                bases: [path.resolve('./.tmp'), path.resolve(__dirname, config.samples_dir)]
            }
        },
        serve: {
            options: {
                livereload: true,
                serverreload: false,
                bases:  [config.www_dir]
            }
        }
    });


    grunt.loadNpmTasks('grunt-express');
}