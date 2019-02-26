require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');

const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

var createError = require('http-errors');

var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var upload = multer({storage: multer.diskStorage({

    destination: function (req, file, callback) 
    { callback(null, './uploads');},
    filename: function (req, file, callback) 
    { callback(null, file.fieldname +'-' + Date.now()+path.extname(file.originalname));}
  
  }),
  
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
  });



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('uploads'));



// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
