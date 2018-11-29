//----------------------------
// Map component
//----------------------------

function europeMapInit() {

    var w = (windowWidth / 2)
    var h = (windowHeight / 2)

    var projection = d3
        .geoMercator()
        .center([5, 51])
        .translate([w / 2, h / 2])
        .scale([w / 1.7]);

    var path = d3
        .geoPath()
        .projection(projection);

    var svg = d3
        .select("#map")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("style", "margin: 0 auto; display: block;  border: 3px solid black;");


    //----------------------------
    // Data and color scale
    //----------------------------

    var data = d3.map();
    var colorScheme = d3.schemeReds[6];
    colorScheme.unshift("#eee");
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
                        .attr("fill", function (d) {
                            return colorScale(data[currentDate][d.properties.name] || 0);
                        })
                        .attr("d", path)
                        .attr("stroke", "rgba(8, 81, 156, 0.4)");
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
            .attr("transform", "translate(" + (-w + 20) + "," + (20) + ")");

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