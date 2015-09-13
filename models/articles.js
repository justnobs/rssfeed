var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var articlesSchema = new Schema({
  title: { type: String, required: true},
  link: { type: String, required: true },
  published: { type: String },
  source_name: { type: String },
  source: { type: String },
  likes: { type: Number }
});

// the schema is useless so far
// we need to create a model using it
var Articles = mongoose.model('Articles', articlesSchema);

// make this available to our users in our Node applications
module.exports = Articles;
