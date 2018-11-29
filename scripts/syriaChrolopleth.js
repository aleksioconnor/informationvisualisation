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



    var width = (windowWidth / 3),
        mapRatio = 1.2,
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
        .attr("style", "margin: 0 auto; display: block;  border: 1px dotted #bfbfbf;");

    d3.json("data/syria-districts-topojson.json").then(function (syr) {
        svg
            .selectAll("path")
            .data(topojson.feature(syr, syr.objects.SYR_adm2).features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#bfbfbf")
            .attr("stroke", "rgba(131,131,131, 0.4)")
            .attr("stroke-width", .3)
            // Update tooltip and info boxes when user hovers over a district on map
            .on("mousemove", function (d) {


                //Update the tooltip position and value
                d3.select("#tooltip")
                    .style("top", (d3.event.pageY) + 20 + "px")
                    .style("left", (d3.event.pageX) + 20 + "px")

                    // update governorate name
                    .select('#governorate')
                    .text(d.properties.NAME_1);

                // update district name
                d3.select("#tooltip")
                    .select("#district")
                    .text(d.properties.NAME_2);

                // Update province and district names in info box
                d3.select('#governorate-name')
                    .text(d.properties.NAME_1);

                d3.select('#district-name')
                    .text(d.properties.NAME_2);

                // Show tooltip
                d3.select("#tooltip").classed("hidden", false);
            })

            // Hide tooltip when user stops hovering over map
            .on("mouseout", function (d) {
                d3.select("#tooltip").classed("hidden", true);
            });

    });

    // resize()

}