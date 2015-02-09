var express = require("express"),
    path = require("path"),
    app = express();

app.set('port', 9000);

app.all('/', function (req, res) {
    res.sendfile(__dirname  + req.originalUrl);
});
//app.use(require('grunt-contrib-livereload/lib/utils').livereloadSnippet);



module.exports = app;

console.log('Express server listening on port ' + app.get('port'));