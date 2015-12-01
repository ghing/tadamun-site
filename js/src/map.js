import d3 from 'd3';

function map() {
  var communities;

  function control(selection) {
    selection.

  }

  control.communities = function(val) {
    if (!arguments.length) {
      return communities;
    }

    communities = val;
  }

  return control;
}

module.exports = map;
