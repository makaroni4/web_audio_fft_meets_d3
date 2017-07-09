function AudioWaveChart(className, freqRange) {
  var $audioWave = $("." + className);

  var w = $audioWave.width();
  var h = $audioWave.height();

  var x_scale = d3.scaleLinear().range([0, w]).domain([0, 1]);
  var y_scale = d3.scaleLinear().range([h, 0]).domain([0, 1]);

  var line = d3.line()
          .x(function(d) {
              return x_scale(d.x);})
          .y(function(d) {
              return y_scale(d.y);
          })

  var graph = d3.select("." + className).append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .append("svg:g");

  graph.append("svg:path")
       .attr("class", className + "-line");

  var mapScale = d3.scaleLinear()
                        .domain([0, freqRange])
                        .range([0, w]);

  var axisBot = d3.axisBottom(mapScale);

  var xsCont = graph.append('g')
    .attr("transform", "translate(0," + h + ")")
    .call(axisBot);

  var setDomain = function(data_xy){
    x_scale.domain(d3.extent(data_xy, function(d){ return d.x}));

    var y_range = d3.extent(data_xy, function(d){ return d.y});

    y_scale.domain([ Math.min(-0.1, y_range[0]), Math.max(0.1, y_range[1]) ]);
  };

  var plotD3Wave = function(data_xy) {
    setDomain(data_xy);
    var svg = d3.select("body").transition();
    svg.select("." + className + "-line")
       .duration(0)
       .attr("d", line(data_xy));
  }

  return {
    plotWave: function(wave) {
      console.log(wave.length)
      var data_xy  = [];

      for(var i = 0; i < wave.length; i++){
        data_xy.push({x: i, y: wave[i]});
      }

      plotD3Wave(data_xy);
    }
  }
}
