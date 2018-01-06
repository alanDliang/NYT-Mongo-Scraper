var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  title: {
    type:String
  },
  body: {
    type:String
  }
});

var Note = mongoose.model('Note', CommentSchema);
module.exports = Note;