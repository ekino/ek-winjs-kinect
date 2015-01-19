var express = require('express');
var path = require('path');
var app = express();

app.get('/vendor/*', function (req, res) {
    res.sendfile(__dirname  + req.originalUrl );
});

app.get('/src/**', function (req, res) {
    res.sendfile(__dirname  + req.originalUrl );
});

app.get('/standalone/**', function (req, res) {
    res.sendfile(__dirname  + req.originalUrl );
});

app.all('/mocks/**', function (req, res) {
    res.sendfile(__dirname  + req.originalUrl);
});

app.all('/ftl/**', function (req, res) {
    res.sendfile(__dirname + req.originalUrl);
});


module.exports = app;

console.log('Express server listening on port ' + app.get('port'));
