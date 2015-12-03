import d3 from 'd3';

// HACK: I couldn't get waypoints to shim correctly with browserify.  It does
// make itself available as window.Waypoint. 
import 'waypoints';
let Waypoint = window.Waypoint;

// TODO: replace with UMD
(function(window) {
  let tadamun = {};

  class App {
    constructor(options) {
      this.options = options;

      this.waypoints = {};

      this.waypoints.highway = new Waypoint({
        element: options.containers.highway,
        handler: function(direction) {
          d3.select(this.element)
            .selectAll('.section__inner')
              .classed('animated', true);
        },
        offset: '90%' 
      });

      this.waypoints.map = new Waypoint({
        element: options.containers.mapSections,
        handler: function(direction) {
          if (direction === 'down') {
            d3.select(options.containers.mapLayers)
              .style('position', 'fixed')
              .style('top', 0);
          }
        }
      });

      let mapSections = d3.select(options.containers.mapSections)
        .selectAll('.section--map');

      mapSections.style('visibility', 'hidden');
      
      d3.select(options.containers.mapSections)
        .selectAll('.section--map')
          .each(function() {
            // When scrolling down, and the top of a section hits the bottom
            // of the viewport ...
            let wp = new Waypoint({
              element: this,
              handler: function(direction) {
                if (direction == 'down') {
                  // Unstick all the sections 
                  mapSections.style('position', 'static');
                  // Hide all the sections 
                  mapSections.style('visibility', 'hidden');
                  // Stick and show this section
                  d3.select(this.element)
                    .style('visibility', 'visible')
                    .style('position', 'fixed')
                    .style('top', 0);
                }
              },
              offset: '100%'
            });

            // When scrolling up, and the bottom of a section enters the top
            // of the viewport ...
            let reverseWp = new Waypoint({
              element: this,
              handler: function(direction) {
                if (direction == 'up') {
                  // Unstick all the sections
                  mapSections.style('position', 'static');
                  // Hide all the sections
                  mapSections.style('visibility', 'hidden');
                  d3.select(this.element)
                    .style('visibility', 'visible')
                    .style('position', 'fixed')
                    .style('top', 0);
                }
              },
              offset: 'bottom-in-view'
            });
          });
    }

    showMapLayers(layers) {
      // BOOKMARK
    }
  }

  tadamun.App = App;

  window.tadamun = tadamun;
})(window);
