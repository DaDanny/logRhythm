'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StudentSchema = new Schema({
  name: String,
  grade : Number,
  active: Boolean
});

module.exports = mongoose.model('Student', StudentSchema);