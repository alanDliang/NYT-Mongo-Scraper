var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');

var PORT = process.env.PORT || 3000;

var DB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoscraper';
mongoose.Promise = global.Promise;

mongoose.connect(DB_URI, { useMongoClient: true });
var db = mongoose.connection;

db.on('error', console.error.bind('console', 'MongoDB connection error'));
db.once('open', () => console.log('connected to database'));

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static('./public'));

// Linking routes
require('./routes/html-routes')(app);
require('./routes/api-routes')(app);