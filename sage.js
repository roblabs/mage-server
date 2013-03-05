var express = require("express");
var mongoose = require('mongoose');
var path = require("path");
var fs = require('fs');
var static = require('node-static');

var app = express();

var application_root = __dirname;
var dbPath = 'mongodb://localhost/sagedb';

// Configuration of the SAGE Express server
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use('/uploads', express.static(path.join(application_root, "uploads")));
  app.use('/extjs', express.static(path.join(application_root, "extjs")));
  app.use('/geoext', express.static(path.join(application_root, "geoext")));
  app.use('/***REMOVED***s', express.static(path.join(application_root, "***REMOVED***s")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  mongoose.connect(dbPath, function(err) {
    if (err) throw err;
  });
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
  });
});

// Import models
var counters = require('./models/Counters')(mongoose);
var models = {
  Feature: require('./models/Feature')(mongoose, counters),
  Team: require('./models/Team')(mongoose),
  ObservationLevel: require('./models/ObservationLevel')(mongoose),
  ObservationType: require('./models/ObservationType')(mongoose)
}

// Import routes
fs.readdirSync('routes').forEach(function(file) {
  if (file[0] == '.') return;
  var route = file.substr(0, file.indexOf('.'));
  require('./routes/' + route)(app, models, fs);
});

// Gets all the Teams with universal JSON formatting    
app.get('/api/v1/teams', function (req, res){
  console.log("SAGE Team GET REST Service Requested");
  return models.TeamModel.find({}, function (err, teams) {
    if( err || !teams.length) {
      console.log("No teams were found.");  
      return res.send("No teams were found.");
    }
    else {
      return res.send(teams);
    };
  });
});

// Gets all the Observation Levels with universal JSON formatting   
app.get('/api/v1/observationLevels', function (req, res){
  console.log("SAGE Observation Levels GET REST Service Requested");
  return models.ObservationLevelModel.find({}, function (err, observation_levels) {
    if( err || !observation_levels.length) {
      console.log("No observation levels were found."); 
      return res.send("No observation levels were found.");
    }
    else {
      return res.send(observation_levels);
    };
  });
});

// Gets all the Observation Types with universal JSON formatting    
app.get('/api/v1/observationTypes', function (req, res){
  console.log("SAGE Observation Types GET REST Service Requested");
  return models.ObservationTypeModel.find({}, function (err, observation_types) {
    if( err || !observation_types.length) {
      console.log("No observation types were found.");  
      return res.send("No observation types were found.");
    }
    else {
      return res.send(observation_types);
    };
  });
});

// Launches the Node.js Express Server
app.listen(4242);
console.log('SAGE Node Server: Started listening on port 4242.');