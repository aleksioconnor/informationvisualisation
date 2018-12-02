//----------------------------
// Map component
//----------------------------

function europeMapInit() {

    // var width = (windowWidth / 3),
    // mapRatio = 1.1,
    // height = width * mapRatio,
    // mapRatioAdjuster = 6, // adjust map ratio here without changing map container size.
    // syria_center = [39, 35]; // Syria's geographical center

    var w = (windowWidth / 3),
        mapRatio = 1.1,
        mapRatioAdjuster = 0.1,
        h = w * mapRatio,
        europeCenter = [9, 50];

    var projection = d3
        .geoMercator()
        .center(europeCenter)
        .translate([w / 2, h / 2])
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
                        .attr("fill", function (d) {
                            return colorScale(data[currentDate][d.properties.name] || 0);
                        })
                } else {
                    // First draw map and fill it with colour
                    mapSVG
                        .data(json.features)
                        .enter()
                        .append("path")
                        .attr("fill", "#bfbfbf")
                        // .attr("fill", function (d) {
                        //     return colorScale(data[currentDate][d.properties.name] || 0);
                        // })
                        .attr("d", path)
                        .attr("stroke", "rgba(131,131,131, 0.4)")
                        .attr("stroke-width", .3)
                        // .on("mousemove", function (d) {
                        //     d3.select("#tooltipEurope")
                        //         .style("top", (d3.event.pageY) + 20 + "px")
                        //         .style("left", (d3.event.pageX) + 20 + "px")
                        //         .select('#country')
                        //         .text(d.properties.name);
                        //     d3.select("#tooltipEurope")
                        //         .select("#refugees")
                        //         .text(data[currentDate][d.properties.name]);
                        //     // d3.select('#governorate-name')
                        //     //     .text(d.properties.NAME_1);
                        //     // d3.select('#district-name')
                        //     //     .text(d.properties.NAME_2);
                        //     // d3.select('#deaths')
                        //     //     .text(deaths[d.properties.NAME_1] || 0);
                        //     d3.select("#tooltipEurope").classed("hidden", false);
                        // })
                        // .on("mouseout", function (d) {
                        //     d3.select("#tooltipEurope").classed("hidden", true);
                        // });
                }

            });
        });
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
    //----------------------------
    // Draw scale
    //----------------------------

    drawScale = function () {
        const x = d3
            .scaleLinear()
            .domain(d3.extent(color.domain()))
            .rangeRound([600, 760]);

        const g = svg
            .append("g")
            .attr("transform", "translate(" + (-w + (-0.35 * w)) + "," + (h - (0.08 * h)) + ")");

        g.selectAll("rect")
            .data(color.range().map(d => color.invertExtent(d)))
            .enter()
            .append("rect")
            .attr("height", 15)
            .attr("x", d => x(d[0]))
            .attr("width", d => x(d[1]) - x(d[0]))
            .attr("fill", d => color(d[0]));

        g.append("text")
            .attr("class", "caption")
            .attr("x", x.range()[0])
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Refugees in europe");

        g.call(
                d3
                .axisBottom(x)
                .tickSize(13)
                .tickFormat(d3.format(""))
                .tickValues(
                    color
                    .range()
                    .slice(1)
                    .map(d => color.invertExtent(d)[0])
                )
            )
            .select(".domain")
            .remove();
    }
    drawScale()
}