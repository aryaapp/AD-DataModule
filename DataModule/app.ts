"use strict";
import express = require('express');
import http = require('http');
import path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var methodOverride = require('method-override');
var session = require('express-session')
var nconf = require('nconf');
var cors = require("cors");
var bugsnag = require("bugsnag");
bugsnag.register("202076a6b0a5f3d70fb9c794b5501ee4", { releaseStage: "production" });

var routes = require('./routes/index');
var data = require('./routes/data');

var app = express();

// all environments
app.use(bugsnag.requestHandler);
app.use(cors());


app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('X-HTTP-Method-Override'));

app.use('/', routes);
app.use('/data', data);

app.use(bugsnag.errorHandler);


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user

app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err,
    });
});
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
