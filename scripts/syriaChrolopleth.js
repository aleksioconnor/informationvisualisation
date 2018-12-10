function resize() {
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

var drawScale;

var colorScale = d3
    .scaleThreshold()
    // .domain([1, 10, 50, 100, 200, 500])
    .domain([1, 50, 100, 300, 500, 800, 1000, 1200, 1400])
    .range(colorScheme);

function syriaMapInit() {

    $('#syria').click(function () {
        barChartType = 'province';
        if (!$('#province-button').hasClass('barsblue')) {
            $('#province-button').toggleClass('barsblue')
        }
        $('#actor').removeClass("barsblue")
        $('#cause').removeClass("barsblue")
        const isSelected = document.getElementById("syria").className === "button barsblue";

        $(this).toggleClass('barsblue')


            !isSelected ? allProvinces.forEach(item => selectedDistricts.add(item)) : allProvinces.forEach(item => selectedDistricts.delete(item))

        rerenderSyriaMap()
        updateBarchart()
        updateSankey()
    });

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


    //----------------------------
    // Draw scale
    //----------------------------
    drawScale = function () {

        var ext_color_domain = [1, 50, 100, 300, 500, 800, 1000, 1200, 1400]

        var legend_labels = ["< 50", "50+", "100+", "300+", "500+", "800+", "1000+", "1200+", "1400+"]

        var color = d3
            .scaleThreshold()
            .domain(ext_color_domain)
            .range(colorScheme)

        var legend = svg.selectAll("g.legend")
            .data(ext_color_domain)
            .enter().append("g")
            .attr("class", "legend");

        var ls_w = 15,
            ls_h = 15,
            x_pos = 270;

        legend.append("rect")
            .attr("x", x_pos)
            .attr("y", function (d, i) {
                return height - (i * ls_h) - 2 * ls_h;
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
                return height - (i * ls_h) - ls_h - 4;
            })
            .text(function (d, i) {
                return legend_labels[i];
            });

    }


    rerenderSyriaMap = function () {

        // console.log('rerendering syria map')

        d3.json("data/provincesDeaths.json").then(data => {

            const deaths = data[currentDate]

            d3.json("data/syria.json").then(function (syr) {

                var mapSVG = svg.selectAll("path")
                const isMapDrown = mapSVG._groups[0].length

                var getProvinceName = (d) =>
                    otherProvinces.includes(d.properties.NAM_EN_REF) ? "Other" : d.properties.NAM_EN_REF;


                if (isMapDrown) {
                    mapSVG
                        .attr("fill", (d) => {

                            const test = colorScale(selectedDistricts.has(getProvinceName(d)) ?
                                deaths[getProvinceName(d)] :
                                0)

                            return test
                        })
                        .attr("opacity", (d) => {

                            if (highlighted.type === 'province' && highlighted.value === getProvinceName(d)) {
                                return "0.4"
                            }

                            return "1.0"
                        })
                } else {
                    // First draw map and fill it with colour


                    mapSVG
                        .data(topojson.feature(syr, syr.objects.syr_admin1).features)
                        .enter()
                        .append("path")
                        .attr("d", path)
                        // .attr("fill", "#bfbfbf")
                        .attr("fill", (d) => {
                            const test = colorScale(selectedDistricts.has(getProvinceName(d)) ?
                                deaths[getProvinceName(d)] :
                                0)


                            return test

                        })
                        .attr("stroke", "rgba(131,131,131, 0.4)")
                        .attr("stroke-width", (d) => {
                            if (selectedDistricts.has(getProvinceName(d))) {
                                return 0.8
                            }
                            return 0.3
                        })
                        .on("mousemove", function (d) {
                            d3.select("#tooltip")
                                .style("top", (d3.event.pageY) + 20 + "px")
                                .style("left", (d3.event.pageX) + 20 + "px")
                                .select('#province')
                                .text(getProvinceName(d));
                            d3.select('#province-name')
                                .text(getProvinceName(d));
                            d3.select('#deaths')
                                .text(deaths[getProvinceName(d)] || 0);

                            // Hide tooltip
                            d3.select("#tooltip").classed("hidden", false);
                            d3.select("#syriaTooltip").classed("hidden", false);
                        })
                        .on("mouseout", function (d) {
                            d3.select("#tooltip").classed("hidden", true);
                            d3.select("#syriaTooltip").classed("hidden", true);
                        })
                        .on("click", function (d) {
                            const provinceName = getProvinceName(d)
                            barChartType = 'province'

                            selectedDistricts.has(provinceName) ?
                                selectedDistricts.delete(provinceName) :
                                selectedDistricts.add(provinceName)
                            if (!$('#province-button').hasClass('barsblue')) {
                                $('#province-button').toggleClass('barsblue')
                            }
                            $('#actor').removeClass("barsblue")
                            $('#cause').removeClass("barsblue")
                            updateBarchart()
                            rerenderSyriaMap()
                            updateSankey()
                        })
                }
            });
        })
        drawScale();
    }

    rerenderSyriaMap()

    // resize()

}