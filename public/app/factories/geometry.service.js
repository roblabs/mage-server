require('angular');

var turfKinks= require('@turf/kinks')
  , turf = require('@turf/helpers');

GeometryService.$inject = [];

function GeometryService() {

  var service = {
    featureHasIntersections: featureHasIntersections
  };

  return service;

  function featureHasIntersections(feature) {
    if (feature.geometry.coordinates[0].length < 4) {
      return false;
    }

    var polygon = turf.polygon(feature.geometry.coordinates);

    var kinks = turfKinks(polygon);


    return kinks.intersections.features.length !== 0;
  }
}

module.exports = GeometryService;
