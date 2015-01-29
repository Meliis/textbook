'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StudentSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  parentFirstName: {type: String, required: true},
  parentLastName: {type: String, required: true},
  phoneNumber: {type: Number, required: true}
});

StudentSchema
.virtual('fullName')
.get(function() {
	return this.firstName + ' ' + this.lastName;
});

StudentSchema
.virtual('parentFullName')
.get(function() {
	return this.parentFirstName + ' ' + this.parentLastName;
});

module.exports = mongoose.model('Student', StudentSchema);