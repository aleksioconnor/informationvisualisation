function resize() {
    console.log('doing resize');

    width = parseInt(d3.select('#viz').style('width'));
    width = width - margin.left - margin.right;
    height = width * mapRatio;

    // update projection
    projection.translate([width / 2, height / 2])
        .center(syria_center)
        .scale(width * [mapRatio + mapRatioAdjuster]);

    // resize map container
    svg.style('width', width + 'px')
        .style('height', height + 'px');

    // resize map
    svg.selectAll("path").attr('d', path);
}

function syriaMapInit() {



    var width = 336,
        mapRatio = 1.1,
        height = width * mapRatio,
        mapRatioAdjuster = 6, // adjust map ratio here without changing map container size.
        syria_center = [39, 35]; // Syria's geographical center

    //Define map projection
    var projection = d3
        .geoMercator()
        .center(syria_center) // sets map center to Syria's center
        .translate([width / 2, height / 2])
        .scale(width * [mapRatio + mapRatioAdjuster]);

    //Define path generator
    var path = d3
        .geoPath()
        .projection(projection);

    // create SVG element
    var svg = d3.select("#syriaMap")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "margin: 0 auto; display: block;");


    var colorScheme = d3.schemeReds[6];
    // colorScheme.unshift("#eee");
    var colorScale = d3
        .scaleThreshold()
        .domain([1, 10, 50, 100, 200, 500])
        .range(colorScheme);


    rerenderSyriaMap = function () {
        d3.json("data/provincesDeaths.json").then(data => {

            const deaths = data[currentDate]

            d3.json("data/syria-districts-topojson.json").then(function (syr) {

                var mapSVG = svg.selectAll("path")

                if (currentDate !== "2013-01") {
                    mapSVG
                        .attr("fill", function (d) {
                            return colorScale(deaths[d.properties.NAME_1] || 0);
                        })
                } else {
                    // First draw map and fill it with colour
                    mapSVG
                        .data(topojson.feature(syr, syr.objects.SYR_adm2).features)
                        .enter()
                        .append("path")
                        .attr("d", path)
                        // .attr("fill", "#bfbfbf")
                        .attr("fill", function (d) {
                            return colorScale(deaths[d.properties.NAME_1] || 0);
                        })
                        .attr("stroke", "rgba(131,131,131, 0.4)")
                        .attr("stroke-width", .3)
                        .on("mousemove", function (d) {
                            d3.select("#tooltip")
                                .style("top", (d3.event.pageY) + 20 + "px")
                                .style("left", (d3.event.pageX) + 20 + "px")
                                .select('#governorate')
                                .text(d.properties.NAME_1);
                            d3.select("#tooltip")
                                .select("#district")
                                .text(d.properties.NAME_2);
                            d3.select('#governorate-name')
                                .text(d.properties.NAME_1);
                            d3.select('#district-name')
                                .text(d.properties.NAME_2);
                            d3.select('#deaths')
                                .text(deaths[d.properties.NAME_1] || 0);

                            // Hide tooltip
                            d3.select("#tooltip").classed("hidden", false);
                            d3.select("#syriaTooltip").classed("hidden", false);
                        })
                        .on("mouseout", function (d) {
                            d3.select("#tooltip").classed("hidden", true);
                            d3.select("#syriaTooltip").classed("hidden", true);
                        });
                }
            });
        })
    }

    rerenderSyriaMap()

    // resize()

}