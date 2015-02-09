'use strict';
/**
 * Gruntfile
 *
 * This Node script is executed when you run `grunt`.
 * It's purpose is to load the Grunt tasks in your project's `tasks`
 * folder, and allow you to add and remove tasks as you see fit.
 *
 * WARNING:
 * Unless you know what you're doing, you shouldn't change this file.
 * Check out the `tasks` directory instead.
 */

module.exports = function (grunt) {

    //load environment config variables
    var config = require('./tasks/config.js');
    grunt.config.set('config', config);

    //load all grunt config files
    grunt.loadTasks('./tasks/config');

    //load all grunt register task
    grunt.loadTasks('./tasks/register');

};
