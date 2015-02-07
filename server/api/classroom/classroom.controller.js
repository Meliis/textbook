'use strict';

var _ = require('lodash');
var Classroom = require('./classroom.model');

// Get list of classrooms
exports.index = function(req, res) {
  Classroom.find(function (err, classrooms) {
    if(err) { return handleError(res, err); }
    return res.json(200, classrooms);
  });
};

// Get a single classroom
exports.show = function(req, res, next) {
  Classroom.findById(req.params.id, function (err, classroom) {
    if(err) { return handleError(res, err); }
    if(!classroom) { return res.send(404); }
  })
  .populate('students')
  .exec(function(err, classroom) {
    if (err) return next(err);
      res.json(classroom);
    });
};

exports.getUnpopulated = function(req, res) {
  Classroom.findById(req.params.id, function (err, classroom) {
    if(err) { return handleError(res, err); }
    if(!classroom) { return res.send(404); }
    return res.json(classroom);
  })
}

// Creates a new classroom in the DB.
exports.create = function(req, res) {
  Classroom.create(req.body, function(err, classroom) {
    if(err) { return handleError(res, err); }
    return res.json(201, classroom);
  });
};

// Updates an existing classroom in the DB.
exports.update = function(req, res) {
  if(req.body._id) { 
    delete req.body._id;
    delete req.body.__v; 
  }
  Classroom.findById(req.params.id, function (err, classroom) {
    if (err) { return handleError(res, err); }
    if(!classroom) { return res.send(404); }
    _.assign(classroom, req.body);
    classroom.markModified('students');
    classroom.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, classroom);
    });
  });
};

// Deletes a classroom from the DB.
exports.destroy = function(req, res) {
  Classroom.findById(req.params.id, function (err, classroom) {
    if(err) { return handleError(res, err); }
    if(!classroom) { return res.send(404); }
    classroom.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
