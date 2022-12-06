require('dotenv').config({ path: require('find-config')('.env') });

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require("cors");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
var mongoose = require('mongoose');
var app = express();

// redo this so that unless either events happen you dont do the rest....
mongoose.connect(process.env.DATABASE_URI);
mongoose.connection.on('error', (err) => console.log(err));
mongoose.connection.on('open', () => console.log("Connected to DB"));

var testCasesAPI = require("./database/testCases");
var submissionsAPI = require("./database/submissions");
var classesAPI = require("./database/classes");
var usersAPI = require("./database/users");
var mossAPI = require("./moss/mossJS");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use("/testAPI", testAPIRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/testcases', testCasesAPI);
app.use('/submissions', submissionsAPI);
app.use('/classes', classesAPI);
app.use('/user', usersAPI);
app.use('/moss', mossAPI);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
