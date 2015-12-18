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
      let mapSections = d3.select(options.containers.mapSections)
        .selectAll('.section--map');
      let mapLayers = d3.select(options.containers.mapLayers);  

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
            mapLayers
              .style('position', 'fixed')
              .style('top', 0);
          }
          else {
            // We're scrolling back up to the top.  Unstick the map layers so
            // the user can see the intro section
            mapLayers
              .style('position', 'static')
              .style('top', 'auto');

            mapSections.style('position', 'static');
          }
        }
      });


      mapSections.style('visibility', 'hidden');
      this.hideMapLayers(['schools', 'healthcare-centers', 'quotes-istabl-antwar', 'quotes-masakin-uthman']);

      mapSections.each(function(d, i) {
        var el = this;

        // When scrolling down, and the top of a section hits the bottom
        // of the viewport ...
        let wp = new Waypoint({
          element: el,
          handler: function(direction) {
            if (direction == 'down') {
              // Unstick all the sections 
              mapSections.style('position', 'static');
              // Hide all the sections 
              mapSections.style('visibility', 'hidden');

              // Stick and show this section
              app.displaySection(this.element);

              if (this.element.id == 'filler-2') {
                // We've scrolled past all the map sections.  Unstick these sections
                mapSections.style('position', 'static');
                // Unstick the map layers
                mapLayers.style('position', 'static');
                // Make the filler layers zero height so the elements all stay in place
                // after the fixed elements are no longer fixed position
                d3.select('#filler-1').style('display', 'none');
                d3.select('#filler-2').style('display', 'none');
              }
            }
          },
          offset: '100%'
        });

        // When scrolling up, and the bottom of a section enters the top
        // of the viewport ...
        let reverseWp = new Waypoint({
          element: el,
          handler: function(direction) {
            if (direction == 'up') {
              if (this.element.id == 'filler-1') {
                // Scrolling back into the map sections
                // Make the map layers stick
                mapLayers.style('position', 'fixed');
                // Give the filler sections a height so everything sits in the right place
                d3.select('#filler-1').style('display', 'block');
                d3.select('#filler-2').style('display', 'block');
              }

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

    displaySection(element, position='fixed') {
      d3.select(element)
        .style('visibility', 'visible')
        .style('position', position)
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
