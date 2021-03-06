var express = require('express');
var router = express.Router();
var request = require('request');

// Set our models (require schemas)
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

// Scrapers
var mongoose = require('mongoose');
var cheerio = require('cheerio');

// Show any mongoose errors
db.on('error', function (err) {
	console.log('Mongoose Error: ', err);
});

//Logged in to db through mongoose, log message
db.once('open', function() {
	console.log('Mongoose connection successful.');
});

// Route for home
router.get('/', function(req, res) {
	res.redirect('/home');
});

// Route using site and cheerio
router.get('/home', function(req, res) {
	request('https://www.nytimes.com/section/technology', function(error, response, html) {
	    var $ = cheerio.load(html);
	    $('article h2').each(function(i, element) {

			var result = {};

			result.title = $(this).children('a').text();
			result.link = $(this).children('a').attr('href');
			console.log(result);

			var entry = new Article (result);

			entry.save(function(err, doc) {
			  if (err) {
			    console.log(err);
			  } else {
			    console.log(doc);
			  }
			});
		});
	});	
	res.render('home');
});		

// Route to see articles saved
router.get('/articles', function(req, res) {
	Article.find({}, function(err, doc){
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

// Route
router.get('/articles/:id', function(req, res) {
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

// Route to delete notes
router.post('/deletenote/:id', function(req, res) {
	console.log(req.params.id);
	Note.findOne({ '_id': req.params.id })
	.remove('note')
	.exec(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

// Route to replace existing note of article with new one
router.post('/articles/:id', function(req, res) {
	var newNote = new Note(req.body);

	newNote.save(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc) {
				if (err) {
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});


module.exports = router;
