//----------------------------
// Map component
//----------------------------

var drawScale;

var t = d3.transition()
    .duration(500)
    .ease(d3.easeLinear);

function europeMapInit() {

    // var width = (windowWidth / 3),
    // mapRatio = 1.1,
    // height = width * mapRatio,
    // mapRatioAdjuster = 6, // adjust map ratio here without changing map container size.
    // syria_center = [39, 35]; // Syria's geographical center

    var w = 336,
        mapRatio = 1.1,
        mapRatioAdjuster = -0.1,
        h = w * mapRatio,
        europeCenter = [9, 50];

    var projection = d3
        .geoMercator()
        .center(europeCenter)
        .translate([w / 2 + 30, h / 2+30])
        .scale(w * [mapRatio + mapRatioAdjuster]);

    var path = d3
        .geoPath()
        .projection(projection);

    var svg = d3
        .select("#map")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("style", "margin: 0 auto; display: block;");



    //----------------------------
    // Data and color scale
    //----------------------------

    var data = d3.map();
    var colorScheme = d3.schemeBlues[6];
    // colorScheme.unshift("#eee");
    var colorScale = d3
        .scaleThreshold()
        .domain([1, 1000, 5000, 10000, 20000, 100000])
        .range(colorScheme);



    //----------------------------
    // Draw scale
    //----------------------------
    drawScale = function () {

        var ext_color_domain = [1, 1000, 5000, 10000, 20000, 100000]

        var legend_labels = ["< 1000", "1000+", "5000+", "10000+", "20000+", "100000+"]

        var color = d3
            .scaleThreshold()
            .domain([1, 1000, 5000, 10000, 20000, 100000])
            .range(colorScheme)

        var legend = svg.selectAll("g.legend")
            .data(ext_color_domain)
            .enter().append("g")
            .attr("class", "legend");

        var ls_w = 15,
            ls_h = 15,
            x_pos = 10;

        legend.append("rect")
            .attr("x", x_pos)
            .attr("y", function (d, i) {
                return h - (i * ls_h) - 2 * ls_h;
            })
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function (d, i) {
                return color(d);
            })
            .style("opacity", 0.8);

        legend.append("text")
            .attr("x", x_pos + 25)
            .attr("y", function (d, i) {
                return h - (i * ls_h) - ls_h - 4;
            })
            .text(function (d, i) {
                return legend_labels[i];
            });


        var thisNode = d3.selectAll("g.legend");
        // console.log(thisNode)
        thisNode.node().parentNode.appendChild(thisNode.node());

    }

    //----------------------------
    // Draw map
    //----------------------------

    rerenderMap = function () {
        d3.json("data/refugees3.json").then(data => {
            d3.json("data/europe.json").then(function (json) {

                var mapSVG = svg
                    .attr("class", "countries")
                    .selectAll("path")

                // todo: fix condition
                if (currentDate !== "2013-01") {
                    mapSVG
                        .transition(t)
                        .attr("fill", function (d) {
                            return colorScale(data[currentDate][d.properties.name] || 0);
                        })
                } else {
                    // First draw map and fill it with colour
                    mapSVG
                        .data(json.features)
                        .enter()
                        .append("path")
                        .attr("d", path)
                        .attr("fill", function (d) {
                            return colorScale(data[currentDate][d.properties.name] || 0);
                        })
                        .attr("stroke", "rgba(131,131,131, 0.4)")
                        .attr("stroke-width", .3)
                        .on("mousemove", function (d) {

                            d3.select("#tooltip")
                                .style("top", (d3.event.pageY) + 20 + "px")
                                .style("left", (d3.event.pageX) + 20 + "px")
                                .select('#country')
                                .text(d.properties.name);

                            d3.selectAll(".date")
                                .text(currentDate || "");

                            d3.select("#tooltip")
                                .select("#refugees")
                                .text(data[currentDate][d.properties.name] || 0);



                            // Hide tooltip
                            d3.select("#tooltip").classed("hidden", false);
                            d3.select("#euroTooltip").classed("hidden", false);
                        })
                        .on("mouseout", function (d) {
                            d3.select("#tooltip").classed("hidden", true);
                            d3.select("#euroTooltip").classed("hidden", true);
                        });
                }

            });
        });
        drawScale()
    }

    rerenderMap()

    var aspect = w / h,
        chart = d3.select('#map');
    d3.select(window)
        .on("resize", function () {
            var targetWidth = chart.node().getBoundingClientRect().width;
            chart.attr("width", targetWidth);
            chart.attr("height", targetWidth / aspect);
        });

    drawScale()
}