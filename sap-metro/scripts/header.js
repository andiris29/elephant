/**
 * header.js
 *
 * Copyright 2014 Michael Barry & Brian Card.  MIT open-source lincense.
 *
 * Render the header for the visualization
 */

(function () {
  "use strict";
  var scale = 0.55;
  var stations = svg.selectAll('.station');
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]).html(function(d) { return d.name; });
  svg.call(tip);

  // Render the station map first, then load the train data and start animating trains
  VIZ.requiresData([
    // nodes and links that comprise the subway system network
    'json!data/station-network.json',
    // hard-coded positions for each station on the map glyph
    'json!data/spider.json',
    'json!data/station-paths.json',
  ], true).done(function (network, spider, paths) {
    // pre-process the data
    var idToNode = {}, idToLine = {}, trips;
    network.nodes.forEach(function (data) {
      data.x = spider[data.id][0];
      data.y = spider[data.id][1];
      idToNode[data.id] = data;
    });
    network.links.forEach(function (link) {
      link.source = network.nodes[link.source];
      link.target = network.nodes[link.target];
      link.source.links = link.source.links || [];
      link.target.links = link.target.links || [];
      link.target.links.splice(0, 0, link);
      link.source.links.splice(0, 0, link);
      idToLine[link.source.id + '|' + link.target.id] = link.line;
      idToLine[link.target.id + '|' + link.source.id] = link.line;
    });

    var lines = {};
    var stationList = [];
    var emergencyStation;
    var emergencyStation2;

    for(var i = 0; i < network.nodes.length; i ++) {
      var node = network.nodes[i];
      var linesBelongTo = [];
      var station = new Station(node.id, node.name, {x : node.x, y : node.y}, node.links);
      if(node.id === "place-sjdd") {
        emergencyStation = station;
      }
      if(node.id === "place-pdl4") {
        emergencyStation2 = station;
      }
      stationList.push(station);
      for(var j = 0; j < node.links.length; j ++) {
        if(linesBelongTo.indexOf(node.links[j].line) === -1) {
          linesBelongTo.push(node.links[j].line);
        }
      }
      for(var k = 0; k < linesBelongTo.length; k ++) {
        lines[linesBelongTo[k]] = lines[linesBelongTo[k]] || [];
        lines[linesBelongTo[k]].push(station);
      }
    }

    var sortedLines = {};

    for(var key in lines) {
      var line = lines[key];
      sortedLines[key] = [];
      for(var i = 0; i < line.length; i ++) {
        var index = paths[key].indexOf(line[i].id);
        sortedLines[key][index] = line[i];
      }
    }

    var Lines = {};

    for(var key in sortedLines) {
      Lines[key] = new Line(sortedLines[key], key, scale, 0.03);
    }

    function renderTrain() {
      //console.log(Lines.red.trains);
      for(var key in Lines) {
        Lines[key].showTrains();
      }
      setTimeout(renderTrain, 50);
    }

    function renderStation() {
      for(var i = 0; i < stationList.length; i ++) {
        stationList[i].generateNum();
      }
      stations.attr('r', function(d) { return d.num * 0.01});
      setTimeout(renderStation, 700);
    }

    function emergency() {
      emergencyStation.setValue(10);
      emergencyStation2.setValue(6);
      d3.select(".station.place-sjdd").style("fill", "red").style("opacity", "0.4").style("stroke-width", "4px").style("stroke", "#fff").on('mouseover', function (d) {
        if (d.pos[1] < 30) {
              tip.direction('e')
                .offset([0, 10]);
            } else {
              tip.direction('n')
                .offset([-10, 0]);
            }
            tip.show(d);
            $('.d3-tip').css("background", "red").css("height", "200px");
          })
          .on('mouseout', tip.hide);
      d3.select(".station.place-pdl4").style("fill", "#f26522").style("opacity", "0.4").style("stroke-width", "3px").style("stroke", "#fff").on('mouseover', function (d) {
        if (d.pos[1] < 30) {
              tip.direction('e')
                .offset([0, 10]);
            } else {
              tip.direction('n')
                .offset([-10, 0]);
            }
            tip.show(d);
          })
          .on('mouseout', tip.hide);
      Lines["#520E79"].setEmergencyStation(emergencyStation, 0).setEmergencySpeed(0.005);
    }

    // watch height to adjust visualization after loading data
    VIZ.watchSize(function () {
      drawMap(svg);
      renderTrain();
      renderStation();
    });

    $(".container").click(emergency);

    function drawMap(svgContainer) {
      
      network.nodes.forEach(function (data) {
        data.pos = [data.x * scale, data.y * scale];
      });
      var endDotRadius = 0.2 * scale;

      var svg = svgContainer
          .attr('width', "1280px")
          .attr('height', "800px")
          .appendOnce('g', 'map-container');

      stations = stations.data(stationList, function (d) { 
        return d.id; });
      stations
          .enter()
          .append('circle')
          .attr('class', function (d) { 
            return 'station middle station-label ' + d.id; })

      stations.attr('cx', function (d) { return scale * d.pos.x; })
          .attr('cy', function (d) { return scale * d.pos.y; });

      // var connections = svg.selectAll('.connect')
      //     .data(network.links, function (d) { return (d.source && d.source.id) + '-' + (d.target && d.target.id); });

      // connections
      //     .enter()
      //     .append('line')
      //     .attr('class', function (d) { return 'connect ' + d.line; });

      // connections
      //     .attr('x1', function (d) { return d.source.pos[0]; })
      //     .attr('y1', function (d) { return d.source.pos[1]; })
      //     .attr('x2', function (d) { return d.target.pos[0]; })
      //     .attr('y2', function (d) { return d.target.pos[1]; })
      //     .attr('stroke-width', '2px').attr('stroke', function(d) {return d.line});

      // line color circles at the end of each line
      function dot(id, clazz) {
        svg.selectAll('circle.' + id)
          .classed(clazz, true)
          .classed('end', true)
          .classed('middle', false)
          .attr('r', Math.max(endDotRadius, 3));
      }
    }
  });
}());

