class MapPlot {


  //https://github.com/d3/d3-scale-chromatic

  constructor() {

    // metric slider
    var map_column = 'population';
    var constant_title = ' in Zurich';
    var varying_title = 'Population';
    var metric_column = 1;

    var width = screen.width * .8,
      height = screen.height * .65,
      centered;

    const projection = d3.geoNaturalEarth1()
      .rotate([0, 0])
      .center([8.54, 47.37]) // WorldSpace: Latitude and longitude of center of switzerland
      .scale(170000)
      .translate([width / 2, height / 2]) // SVG space
      .precision(.1);


    var path = d3.geoPath()
      .projection(projection);

    var svg_map = d3.select("#map-container").append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("id", "map-svg");

    var g = svg_map
      .append("g");

    // country tooltip_map
    var tooltip_map = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


    // - Population
    // - addresses
    // - sports Facilities
    // - fountains
    // - Street lights
    // - Police locations
    // - parks
    // - hospitality companies
    // - Handicapped

    var space_metrics = {
      1: "Population",
      2: "Addresses/ Buildings",
      3: "Sports Facilities",
      4: "Fountains",
      5: "Street Lights",
      6: "Police Locations",
      7: "Parks",
      8: "Hospitality Companies",
      9: "Handicapped Toilets/Parkings"
    }

    var space_metric_csv = {
      1: "population",
      2: "addresses",
      3: "sport_facilities",
      4: "fountains",
      5: "street_lights",
      6: "police_locations",
      7: "parks",
      8: "hospitality_companies",
      9: "handicapp"
    }





    d3.csv("./data/aggregated_zurich_data.csv", function(error, zurich_ind) {

      let zipCode_to_population = {};

      console.log(zurich_ind)

      zurich_ind.forEach((row) => {
        zipCode_to_population[row.zip] = parseFloat(row.population);
      });

      // console.log(zipCode_to_population)
      // console.log(zurich_ind);

      d3.json("./data/zurich_zips.geojson", function(error, geojson) {
        // console.log(geojson);
        //const zip_paths = topojson.feature(topojson_raw, topojson_raw.objects.cantons);
        const map_data = geojson.features;


        map_data.forEach(function(postalArea, i) {
          postalArea.properties.population = zipCode_to_population[postalArea.properties.ZIP];
          for (var j = 2; j <= Object.keys(space_metric_csv).length; j++) {
            postalArea.properties[space_metric_csv[j]] = zurich_ind[i][space_metric_csv[j]];
          }
        });

        console.log(map_data)

        function sortNumber(a, b) {
          return a - b;
        }

        var DataArray = Array.from(new Set(zurich_ind.map(function(d) {
          return +d['population']
        }).sort(sortNumber)));

        var coloring = d3.scaleQuantile()
          .domain(DataArray)
          .range(d3.schemeRdPu[8]);

        // get color for a country (sum over all years)
        function getColor(valueIn, coloring) {
          // get data array for quantile colors

          var color = coloring(valueIn);
          if (color != null)
            return color;
        }

        $(document).ready(function() {

          // slider
          var slider = document.getElementById("slider");
          var title = document.getElementById("dataset-title");
          var metricIndex = slider.value;


          $("#slider").slider({
              value: 1,
              min: 1,
              max: Object.keys(space_metrics).length,
              step: 1,
              slide: function(event, ui) {
                $('#year').fadeIn();

                // set year variable
                metric_column = ui.value;
                varying_title = space_metrics[ui.value];
                console.log("Metric changed to " + metric_column)

                //update HTML
                var metric = "";
                // if (varying_title != "Population") {
                //   metric = " Indicator";
                // }

                title.innerHTML = '<h2 id="plotHeader">' + varying_title + metric + constant_title + "</h2>";

                //update map
                sequenceMap(map_data, metric_column);
              }
            })
            .each(function() {

              // Add labels to slider whose values
              // are specified by min, max

              // Get the options for this slider (specified above)
              var opt = $(this).data().uiSlider.options;

              // Get the number of possible values
              var vals = opt.max - opt.min;

              // Position the labels
              for (var i = 0; i <= vals; i++) {

                // Create a new element and position it with percentages
                var el = $('<label>' + space_metrics[i + opt.min] + '</label>').css('left', (i / vals * 100) + '%');

                // Add the element inside #slider
                $("#slider").append(el);

              }

            });;
        });


        /* functions for updatig the colors of the map */
        function sequenceMap(data, metric_column) {

          var csvToUse = zurich_ind;

          map_column = space_metric_csv[metric_column];

          var metricArray = Array.from(new Set(csvToUse.map(function(d) {
            return +d[map_column]
          }).sort(sortNumber)));

          var quantiles = 6;

          if (metric_column == 6) {
            quantiles = 4;
          } else if (metric_column == 1 || metric_column == 2) {
            quantiles = 8;
          }

          var coloring = d3.scaleQuantile()
            .domain(metricArray)
            .range(d3.schemeRdPu[quantiles]);

          d3.select("#color-legend").select("div").remove();
          color_legend("Color Map ", coloring);
          // console.log(map_column);
          // console.log(data);
          d3.selectAll(".code").transition() //select all the countries and prepare for a transition to new values
            .duration(500) // give it a smooth time period for the transition
            .style('fill', function(d) {
              console.log(map_column);
              return getColor(d.properties[map_column], coloring); // the end color value
            })
        }


        // animated map (play button)
        var playing = false;

        color_legend("Quantiles ", coloring);

        function color_legend(title, scale) {
          var legend = d3.legendColor()
            .labelFormat(d3.format(",.0f"))
            .cells(10)
            .scale(scale);

          var div = d3.select("#color-legend").append("div")
            .attr("class", "column");

          div.append("h4").text(title);

          var svg_map = div.append("svg");

          svg_map.append("g")
            .attr("class", "legendQuant")
            .attr("transform", "translate(20,10)");


          svg_map.select(".legendQuant")
            .call(legend);
        }

        // create map
        g.selectAll("path")
          .data(map_data)
          .enter()
          .append("path")
          .attr("class", "code") // give them a class for styling and access later
          .attr("d", path)
          .style("stroke", "white")
          .style('fill', function(d) {
            return getColor(d.properties[map_column], coloring);
          })

          .on("mouseover", function() {
            d3.select(this).transition()
              .duration("100")
              .style("fill-opacity", ".1");

            // Show tooltip_map
            tooltip_map.transition()
              .duration(200)
              .style("opacity", .9);

          })
          .on("mousemove", function(d) {

            var normalizedStr = "";
            if (metric_column != 1) {
              normalizedStr = "Number of "
            }
            // Place the tooltip_map
            tooltip_map.style("left", (d3.mouse(this)[0]) + "px")
              .style("top", d3.event.pageY + "px");

            // create tooltip on the map
            tooltip_map.html("<h4> Postal Code " + d.properties.ZIP + "</h4>" +
              "<p>" + normalizedStr + space_metrics[metric_column] + ": " +
              parseInt(d.properties[space_metric_csv[metric_column]]) + "</p>");
            // "Population: " + parseInt(d.properties[desc]) +

          })
          .on("mouseout", function() {
            tooltip_map.transition()
              .duration(200)
              .style("opacity", 0);
            d3.select(this)
              .transition()
              .duration("100")
              .style("fill-opacity", "1")
          })
          .on("click", postalAreaClicked)




      });

    });





    function postalAreaClicked(d) {
      var posX, posY, zoomScale;

      // we click inside the country
      if (d && centered !== d) {
        var centroid = path.centroid(d);
        //we retrieve the x and y coordination of where we clicked
        posX = centroid[0] - 20;
        posY = centroid[1] + 100;
        //determines how much we will zoom
        zoomScale = 1.3;
        centered = d;

      } else {
        // test if we double click twice
        //reposition to center of the screen and update zoom scale
        posX = width / 2;
        posY = height / 2;
        zoomScale = 1;
        centered = null;
      }


      g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomScale + ")translate(" + -posX + "," + -posY + ")")
        .on("start", function() {

          if (centered === d) {
            d3.select("#details").remove();
            var zipArea = d.properties.ZIP;
            // generateChart(zipArea);
          } else {
            d3.select("#details").remove();
          }
        });
    }


  }

}


function whenDocumentLoaded(action) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", action);
  } else {
    // `DOMContentLoaded` already fired
    action();
  }
}

whenDocumentLoaded(() => {
  plot_object = new MapPlot();
  // plot object is global, you can inspect it in the dev-console
});
