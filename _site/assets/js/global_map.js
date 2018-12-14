class MapPlot {


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


    var space_metrics = {
      1: "Population",
      2: "Security",
      3: "Social",
      4: "Handicapp",
      5: "Safety"
    }


    d3.csv("./data/open_data_aggregated.csv", function(error, csv) {
      let zipCode_to_population = {};

      // console.log(csv)

      csv.forEach((row) => {
        zipCode_to_population[row.zip] = parseFloat(row.population);
      });


      // console.log(zipCode_to_population)

      d3.json("./data/zurich_zips.geojson", function(error, geojson) {
        // console.log(geojson);
        //const zip_paths = topojson.feature(topojson_raw, topojson_raw.objects.cantons);
        const map_data = geojson.features;


        map_data.forEach(postalArea => {
          postalArea.properties.population = zipCode_to_population[postalArea.properties.ZIP];
        });

        //console.log(map_data)

        function sortNumber(a, b) {
          return a - b;
        }

        var DataArray = Array.from(new Set(csv.map(function(d) {
          return +d['population']
        }).sort(sortNumber)));


        var coloring = d3.scaleQuantile()
          .domain(DataArray)
          .range(d3.schemeOrRd[8]);

        // get color for a country (sum over all years)
        function getColor(valueIn) {
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
                title.innerHTML = '<h2 id="plotHeader">' + varying_title + constant_title + "</h2>";

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
          map_column = space_metrics[metric_column];
          d3.selectAll('.country').transition() //select all the countries and prepare for a transition to new values
            .duration(500) // give it a smooth time period for the transition
            .style('fill', function(d) {
              return getColor(d.properties[map_column]); // the end color value
            })
        }


        // animated map (play button)
        var playing = false;

        color_legend("Color Map (Quantiles)", coloring);

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
            return getColor(d.properties[map_column]);
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
            // Place the tooltip_map
            tooltip_map.style("left", (d3.mouse(this)[0]) + "px")
              .style("top", d3.event.pageY + "px");

            // create tooltip on the map
            tooltip_map.html("<h4> Postal Code " + d.properties.ZIP + "</h4>" +
              "<p>" + space_metrics[metric_column] + ":" + parseInt(d.properties[map_column]) + "</p>");
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
            posX = centroid[0]-20;
            posY = centroid[1]+100;
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
            .on("start", function () {

                if (centered === d) {
                    d3.select("#details").remove();
                    var zipArea = d.properties.ZIP;
                    // generateChart(zipArea);
                } else {
                    d3.select("#details").remove();
                }
            });
    }

    /* country details chart */
    function generateChart(postalArea) {


      var widthDiv = 0.4 * parseInt(window.width);
      var heightDiv = parseInt(window.height) * .8;

      d3.select("body").append("div")
        .attr("id", "details")
        .attr("class", "sidebar");


      d3.select("#details")
        .style("width", "40%")
        .style("height", "100%")
        .style("padding", "14px");

      var barChartColor = "rgb(0,122,255)";

      var margin = {
          top: 20,
          right: 40,
          bottom: 30,
          left: 20
        },
        width = widthDiv - margin.left - margin.right,
        height = heightDiv / 3 - margin.top - margin.bottom;

      var parseDate = d3.timeParse("%Y");

      //we only specify the range so far. the domain will be specified later on
      //  .range([0, width])
      var xScale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);

      //xAxis
      var xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.timeFormat("%Y"));

      add_title();


      charts("civilians", 'Civilian Deaths', 'Deaths');
      charts("total", 'Total Deaths', 'Deaths');
      charts("events", 'Event Count', 'Events');
      charts("gdp", 'GDP', 'billions $');

      function add_title() {
        d3.select("#details").html('<h2>' + postalArea + '<i class="material-icons clear-icon">clear</i></h2>')
      }

      function charts(field, ylabel, appendix) {
        var yScale = d3.scaleLinear().range([height, 0]);
        var chart_height = height + margin.top + margin.bottom;

        d3.select("#details")
          .append("h3")
          .attr("id", "title" + field)
          .html(ylabel);

        var svg_map = d3.select("#details")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", chart_height)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("./data/country-details/" + country + ".csv", function(error, data) {
          if (error) throw error;

          data.forEach(function(d) {
            d.year = parseDate(d.year);
            d.civilians = parseInt(d.civilians);
            d.total = parseInt(d.total);
            d.events = parseInt(d.events);
            d.gdp = parseFloat(parseFloat(d.gdp / 1e+9).toFixed(2));
          });
          xScale.domain(data.map(function(d) {
            return d.year;
          }));

          yScale.domain([0, d3.max(data, function(d) {
            return d[field];
          })]);

          //X axis with its values
          svg_map.append("g")
            .attr("id", "Xaxis")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "translate(6,4),rotate(-45)");


          svg_map.selectAll("bar")
            .data(data) //bound data
            .enter()
            .append("rect")
            .style("fill", barChartColor)
            .attr("x", function(d) {
              return xScale(d.year);
            })
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) {
              return yScale(d[field]);
            })
            .attr("height", function(d) {
              return height - yScale(d[field]); // we want the bar charts to grow  bottom up
            })

            .on("mouseover", function(d) {
              d3.select(this)
                .transition()
                .duration(100)
                .style("fill", "#5bc0de");

              d3.select("#title" + field)
                .append("text")
                .attr("id", "info_display")
                .attr("class", "right-aligned")
                .text(d[field] + " " + appendix)

            })
            .on("mouseout", function() {
              d3.select(this)
                .transition()
                .duration(100)
                .style("fill", barChartColor);

              d3.select("#title" + field).select("#info_display")
                .remove()
            })
        });

      }
      // function to get back to main view on close
      d3.select(".clear-icon").on("click", function() {
        var posX = width / 2;
        var posY = height / 2;
        var zoomScale = 1;

        g.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomScale + ")translate(" + -posX + "," + -posY + ")");
        d3.select("#details").remove();
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
