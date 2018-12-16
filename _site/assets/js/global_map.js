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

    var description_text = {
      1: "There are 400,028 inhabitants in Zurich in total. Number of Population per zip code ranges roughly from 4000 thousand to 34000. It has to be noted that bigger areas do not necessarily correspond to the higher numbers of population. However, one could say that north west postal areas are the most densely populated.",
      2: "Dataset provides information about number of buildings/addressed for each zope code. The number varies from 433 to 4134. Larger postal areas correspond to the higher number of building, which makes logical sense. However, one can clearly see that most buildings/addressed are located in the north west postal areas 8048, 8046 and 8049.",
      3: "Sports facilities are sum of all of the public sport amenities (pools, soccer pitches, volleyball fields, sports halls, etc.). However, numbers provided are very small since most of the existing sports facilities in Zurich are private. Therefore, this dataset can not serve as an indicator of sportiness of people in the area. However, since the north part of the Zurich makes the most populated district, it is logical that it has the most public sport facilities.",
      4: "Number of fountains varies from 15 to 148 per zip code. Postal areas with the most fountains are located in the north of Zurich. North part is the most populous district of Zurich, so it is understandable that it would have the most fountains.",
      5: "Number of streetlights varies from 641 to 2967 per zip code. One could observe a clear pattern, that higher number of buildings and larger populations correspond to the higher number of streetlights.",
      6: "There are just a few police locations in Zurich. One could say that zip codes with the most number of inhabitants and building correspond to the higher number of police locations.",
      7: "Aggregation of two datasets. Namely of public parks and picnic areas. Number of parks per zip code varies from 1 to 17. With 8049 and 8037 being the postal areas with the most parks. With 8049 zip code being area with one of the highest number of inhabitants.",
      8: "Number of hospitality companies vary from 8 to 415. It is obvious that the dataset does not contain full information, however we assumed that it is a random sample, meaning we have different scale and that relative values of different zip codes give valid information. ",
      9: "Number of handicapped Toilets/Parkings vary from 2 to 44. Only postal areas in the south east have just a few handicapped equipped facilities. Rest of the zip codes seem to be more handicap friendly."
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

          // console.log(description_text[metric_column]);
          d3.select('#map_desc').text(description_text[metric_column]);

          d3.select("#color-legend").select("div").remove();
          color_legend("Color Map ", coloring);
          // console.log(map_column);
          // console.log(data);
          d3.selectAll(".code").transition() //select all the countries and prepare for a transition to new values
            .duration(500) // give it a smooth time period for the transition
            .style('fill', function(d) {
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


            var tooltip_text =   "<p>" + normalizedStr + space_metrics[metric_column] + ": " +
              parseInt(d.properties[space_metric_csv[metric_column]]) + "</p>";


            for(var i=1; i< Object.keys(space_metric_csv).length; i++) {
              if (i != metric_column) {

                normalizedStr = "";
                if (i != 1) {
                  normalizedStr = "Number of "
                }


                tooltip_text += "<p>" + normalizedStr + space_metrics[i] + ": " +
                parseInt(d.properties[space_metric_csv[i]]) + "</p>";
              }

            }
            // create tooltip on the map
            tooltip_map.html("<h4> Postal Code " + d.properties.ZIP + "</h4>" + tooltip_text);

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
