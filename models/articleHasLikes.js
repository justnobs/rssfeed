var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ArticlesHasLikes = new Schema({
  title: { type: String, required: true},
  cookie_id: { type: String, required: true }
});

// the schema is useless so far
// we need to create a model using it
var ArticlesHasLikes = mongoose.model('ArticlesHasLikes', ArticlesHasLikes);

// make this available to our users in our Node applications
module.exports = ArticlesHasLikes;
