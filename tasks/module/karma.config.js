// Karma configuration

var baseDir = '';
var buildDir = '.tmp';
var reportsDir = 'reports';

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../..',

        //used framework
        frameworks: ['jasmine'],

        //This is the list of file patterns to load into the browser during testing.
        files: [
            baseDir + 'src/**/*.js',
            baseDir + 'test/unit/**/*.spec.js'
        ],

        // list of files / patterns to exclude
        exclude: [
        ],

        // web server port
        port: 8080,

        // Fix karma random disconnection
        browserNoActivityTimeout: 5000,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-html-reporter',
            'karma-mocha-reporter',
            'karma-junit-reporter',
        ],

        preprocessors: {
            '**/client/src/**/*.js': 'coverage',
        },

        reporters: ['mocha', 'html', 'coverage'],

        coverageReporter: {
            type: 'cobertura',
            dir: reportsDir,
            subdir: 'coverage',
            file: 'cobertura-result.xml'
        },

        htmlReporter: {
            outputDir: reportsDir + '/test/html'
        },

        junitReporter: {
            outputFile: reportsDir + '/test-result.xml',
            suite: ''
        },

        colors: true,

        logLevel: 'info',

        urlRoot: '/__test/'
    });
};