(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// HACK: I couldn't get waypoints to shim correctly with browserify.  It does
// make itself available as window.Waypoint.

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

require('waypoints');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Waypoint = window.Waypoint;

// TODO: replace with UMD
(function (window) {
  var tadamun = {};

  var App = (function () {
    function App(options) {
      _classCallCheck(this, App);

      var app = this;
      var mapSections = _d2.default.select(options.containers.mapSections).selectAll('.section--map');
      var mapLayers = _d2.default.select(options.containers.mapLayers);

      this.options = options;

      this.waypoints = {};

      // When the highway enters the viewport, start the animation
      // Note that we detect when the #filler-1 element enters,
      // rather than #highway
      // due to the way we're making elements sticky
      this.waypoints.highway = new Waypoint({
        element: _d2.default.select('#filler-1').node(),
        handler: function handler(direction) {
          if (direction == 'down') {
            _d2.default.select(options.containers.highway).selectAll('.section__inner').classed('animated', true);
          }
        },
        offset: '100%'
      });

      this.waypoints.map = new Waypoint({
        element: options.containers.mapSections,
        handler: function handler(direction) {
          if (direction === 'down') {
            mapLayers.style('position', 'fixed').style('top', 0);
          } else {
            // We're scrolling back up to the top.  Unstick the map layers so
            // the user can see the intro section
            mapLayers.style('position', 'static').style('top', 'auto');

            mapSections.style('position', 'static');
          }
        }
      });

      mapSections.style('visibility', 'hidden');
      this.hideMapLayers(['schools', 'healthcare-centers', 'quotes-istabl-antwar', 'quotes-masakin-uthman']);

      mapSections.each(function (d, i) {
        var el = this;

        // When scrolling down, and the top of a section hits the bottom
        // of the viewport ...
        var wp = new Waypoint({
          element: el,
          handler: function handler(direction) {
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
                _d2.default.select('#filler-1').style('display', 'none');
                _d2.default.select('#filler-2').style('display', 'none');
              }
            }
          },
          offset: '100%'
        });

        // When scrolling up, and the bottom of a section enters the top
        // of the viewport ...
        var reverseWp = new Waypoint({
          element: el,
          handler: function handler(direction) {
            if (direction == 'up') {
              if (this.element.id == 'filler-1') {
                // Scrolling back into the map sections
                // Make the map layers stick
                mapLayers.style('position', 'fixed');
                // Give the filler sections a height so everything sits in the right place
                _d2.default.select('#filler-1').style('display', 'block');
                _d2.default.select('#filler-2').style('display', 'block');
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

    _createClass(App, [{
      key: 'displaySection',
      value: function displaySection(element) {
        var position = arguments.length <= 1 || arguments[1] === undefined ? 'fixed' : arguments[1];

        _d2.default.select(element).style('visibility', 'visible').style('position', position).style('top', 0);

        if (element.id == 'distance') {
          this.showMapLayers(['distance']);
          this.hideMapLayers(['schools', 'healthcare-centers', 'quotes-istabl-antwar', 'quotes-masakin-uthman']);
          this.hideMapLayers(['schools']);
        } else {
          this.hideMapLayers(['distance']);
        }

        if (element.id == 'schools-istabl-antwar' || element.id == 'schools-masakin-uthman') {
          this.hideMapLayers(['healthcare-centers', 'quotes-istabl-antwar', 'quotes-masakin-uthman']);
          this.showMapLayers(['schools']);
        } else if (element.id == 'healthcare-istabl-antwar' || element.id == 'healthcare-masakin-uthman') {
          this.hideMapLayers(['schools', 'quotes-istabl-antwar', 'quotes-masakin-uthman']);
          this.showMapLayers(['healthcare-centers']);
        } else if (element.id == 'same-problems-istabl-antwar') {
          this.hideMapLayers(['schools', 'healthcare-centers', 'quotes-masakin-uthman']);
          this.showMapLayers(['quotes-istabl-antwar']);
        } else if (element.id == "same-problems-masakin-uthman") {
          this.hideMapLayers(['schools', 'healthcare-centers', 'quotes-istabl-antwar']);
          this.showMapLayers(['quotes-masakin-uthman']);
        }
      }
    }, {
      key: 'hideMapLayers',
      value: function hideMapLayers(layers) {
        var mapSVG = _d2.default.select(this.options.containers.mapSVG);

        layers.forEach(function (layerName) {
          if (layerName == 'distance') {
            mapSVG.select('#map-svg__distance').style('visibility', 'hidden');
          } else if (layerName == 'schools') {
            mapSVG.select('#map-svg__schools').style('visibility', 'hidden');
          } else if (layerName == 'healthcare-centers') {
            mapSVG.select('#map-svg__healthcare-centers').style('visibility', 'hidden');
          } else if (layerName == 'quotes-istabl-antwar') {
            mapSVG.select('#map-svg__quotes-istabl-antwar').style('visibility', 'hidden');
          } else if (layerName == 'quotes-masakin-uthman') {
            mapSVG.select('#map-svg__quotes-masakin-uthman').style('visibility', 'hidden');
          }
        });
      }
    }, {
      key: 'showMapLayers',
      value: function showMapLayers(layers) {
        var mapSVG = _d2.default.select(this.options.containers.mapSVG);

        layers.forEach(function (layerName) {
          if (layerName == 'distance') {
            mapSVG.select('#map-svg__distance').style('visibility', 'visible');
          } else if (layerName == 'schools') {
            mapSVG.select('#map-svg__schools').style('visibility', 'visible');
          } else if (layerName == 'healthcare-centers') {
            mapSVG.select('#map-svg__healthcare-centers').style('visibility', 'visible');
          } else if (layerName == 'quotes-istabl-antwar') {
            mapSVG.select('#map-svg__quotes-istabl-antwar').style('visibility', 'visible');
          } else if (layerName == 'quotes-masakin-uthman') {
            mapSVG.select('#map-svg__quotes-masakin-uthman').style('visibility', 'visible');
          }
        });
      }
    }]);

    return App;
  })();

  tadamun.App = App;

  window.tadamun = tadamun;
})(window);

},{"d3":"d3","waypoints":"waypoints"}]},{},[1])


//# sourceMappingURL=app.js.map
