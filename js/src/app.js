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
      let app = this;

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
      this.hideMapLayers(['schools', 'healthcare-centers', 'quotes-istabl-antwar', 'quotes-masakin-uthman']);
      
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
                  app.displaySection(this.element);
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

                  // Stick and show this section
                  app.displaySection(this.element);
                }
              },
              offset: 'bottom-in-view'
            });
          });
    }

    displaySection(element) {
      d3.select(element)
        .style('visibility', 'visible')
        .style('position', 'fixed')
        .style('top', 0);

      if (element.id == 'distance') {
        this.showMapLayers(['distance']);
        this.hideMapLayers(['schools', 'healthcare-centers', 'quotes-istabl-antwar', 'quotes-masakin-uthman']);
        this.hideMapLayers(['schools']);
      }
      else {
        this.hideMapLayers(['distance']);
      }

      if (element.id == 'schools-istabl-antwar' ||
          element.id == 'schools-masakin-uthman') {
        this.hideMapLayers(['healthcare-centers', 'quotes-istabl-antwar', 'quotes-masakin-uthman']);
        this.showMapLayers(['schools']);
      }
      else if (element.id == 'healthcare-istabl-antwar' ||
          element.id == 'healthcare-masakin-uthman') {
        this.hideMapLayers(['schools', 'quotes-istabl-antwar', 'quotes-masakin-uthman']);
        this.showMapLayers(['healthcare-centers']);
      }
      else if (element.id == 'same-problems-istabl-antwar') {
        this.hideMapLayers(['schools', 'healthcare-centers', 'quotes-masakin-uthman']);
        this.showMapLayers(['quotes-istabl-antwar']);
      }
      else if (element.id == "same-problems-masakin-uthman") {
        this.hideMapLayers(['schools', 'healthcare-centers', 'quotes-istabl-antwar']);
        this.showMapLayers(['quotes-masakin-uthman']);
      }
    }

    hideMapLayers(layers) {
      let mapSVG = d3.select(this.options.containers.mapSVG);

      layers.forEach(function(layerName) {
        if (layerName == 'distance') {
          mapSVG.select('#map-svg__distance')
            .style('visibility', 'hidden');
        }  
        else if (layerName == 'schools') {
          mapSVG.select('#map-svg__schools')
            .style('visibility', 'hidden');
        }
        else if (layerName == 'healthcare-centers') {
          mapSVG.select('#map-svg__healthcare-centers')
            .style('visibility', 'hidden');
        }
        else if (layerName == 'quotes-istabl-antwar') {
          mapSVG.select('#map-svg__quotes-istabl-antwar')
            .style('visibility', 'hidden');
        }
        else if (layerName == 'quotes-masakin-uthman') {
          mapSVG.select('#map-svg__quotes-masakin-uthman')
            .style('visibility', 'hidden');
        }
      });
    }

    showMapLayers(layers) {
      let mapSVG = d3.select(this.options.containers.mapSVG);

      layers.forEach(function(layerName) {
        if (layerName == 'distance') {
          mapSVG.select('#map-svg__distance')
            .style('visibility', 'visible');
        }  
        else if (layerName == 'schools') {
          mapSVG.select('#map-svg__schools')
            .style('visibility', 'visible');
        }
        else if (layerName == 'healthcare-centers') {
          mapSVG.select('#map-svg__healthcare-centers')
            .style('visibility', 'visible');
        }
        else if (layerName == 'quotes-istabl-antwar') {
          mapSVG.select('#map-svg__quotes-istabl-antwar')
            .style('visibility', 'visible');
        }
        else if (layerName == 'quotes-masakin-uthman') {
          mapSVG.select('#map-svg__quotes-masakin-uthman')
            .style('visibility', 'visible');
        }
      });
    }
  }

  tadamun.App = App;

  window.tadamun = tadamun;
})(window);
