import d3 from 'd3';

// HACK: I couldn't get waypoints to shim correctly with browserify.  It does
// make itself available as window.Waypoint. 
import 'waypoints';
var Waypoint = window.Waypoint;

// TODO: replace with UMD
(function(window) {
  var tadamun = {};

  class App {
    constructor(options) {
      this.waypoints = {};

      this.waypoints.highway = new Waypoint({
        element: options.containers.highway,
        handler: function(direction) {
          console.log("HIGHWAY");
        },
        offset: 0
      });
    }
  }

  tadamun.App = App;

  window.tadamun = tadamun;
})(window);