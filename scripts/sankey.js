function sankeyInit() {

    function format(d) {
        const f = d3.format(",.0f");
        return `${f(d)}`;
    }

    var t = d3.transition()
        .duration(100)
        .ease(d3.easeLinear);

    var width = 706
    var height = 370

    var sankey = d3.sankey().size([width, height]).iterations(0); // Constructs a new Sankey generator with the default settings.


    var svg = d3.select("#sankey").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "margin: 0 auto; display: block;")

    var links = svg.append("g")
        .attr("class", "links");

    var nodes = svg.append("g")
        .attr("class", "nodes")



    // lol is this what they call callback hell
    d3.json("../data/sankey2013.json").then(function (data2013) {
        d3.json("../data/sankey2014.json").then(function (data2014) {
            d3.json("../data/sankey2015.json").then(function (data2015) {
                d3.json("../data/sankey2016.json").then(function (data2016) {
                    d3.json("../data/sankey2017.json").then(function (data2017) {

                        var data = {
                            '2013': sankey(data2013),
                            '2014': sankey(data2014),
                            '2015': sankey(data2015),
                            '2016': sankey(data2016),
                            '2017': sankey(data2017),
                        }
                        updateSankey = function () {
                            var date = newDate.substring(0, 4); // year
                            $('#sankey-year').html(date)
                            var graph = data[date];

                            var link = links.selectAll("path")
                                .data(graph.links, function (d) {
                                    return d;
                                });

                            var linkEnter = link.enter().append("path")
                                .attr("d", d3.sankeyLinkHorizontal())
                                .attr("class", "link")
                                .attr("stroke-width", function (d) {
                                    return Math.max(1, d.width);
                                });

                            link.transition(t)
                                .attr("d", d3.sankeyLinkHorizontal())
                                .attr("stroke-width", function (d) {
                                    return Math.max(1, d.width);
                                });

                            linkEnter.append("title")
                                .text(function (d) {
                                    return d.source.name + " → " + d.target.name + "\n" + format(d.value);
                                });

                            link.exit().remove();


                            var node = nodes.selectAll("g")
                                .data(graph.nodes, function (d) {
                                    return d.name;
                                });

                            var nodeEnter = node.enter().append("g");

                            nodeEnter.append("rect")
                                .attr("class", "s-node")
                                .attr("x", function (d) {
                                    return d.x0;
                                })

                                .attr("y", function (d) {
                                    return d.y0;
                                })
                                .attr("height", function (d) {
                                    return Math.max(1, d.y1 - d.y0);
                                })
                                .attr("width", function (d) {
                                    return d.x1 - d.x0;
                                })
                                .attr("opacity", d => {
                                    var count = Math.max(d.sourceLinks.length, d.targetLinks.length);
                                    // return (d.index + 0.1) * 0.02 + 0.3;
                                    return d.value * 0.00009 + 0.3
                                })
                                .on("click", function (d) {
                                    if (allProvinces.includes(d.name)) {
                                        const provinceName = d.name;
                                        barChartType = 'province'

                                        selectedDistricts.has(provinceName) ?
                                            selectedDistricts.delete(provinceName) :
                                            selectedDistricts.add(provinceName)

                                        if (!$('#province-button').hasClass('barsblue')) {
                                            $('#province-button').toggleClass('barsblue')
                                        }

                                        $('#actor').removeClass("barsblue")
                                        $('#cause').removeClass("barsblue")

                                        rerenderSyriaMap();
                                        updateBarchart()
                                        updateSankey()

                                    }

                                    if (allActors.includes(d.name)) {
                                        const actorName = d.name;
                                        barChartType = 'actor'

                                        selectedActors.has(actorName) ?
                                            selectedActors.delete(actorName) :
                                            selectedActors.add(actorName)

                                        if (!$('#actor').hasClass('barsblue')) {
                                            $('#actor').toggleClass('barsblue')
                                        }
                                        $('#province-button').removeClass("barsblue")
                                        $('#cause').removeClass("barsblue")

                                        updateBarchart()
                                        updateSankey()
                                    }

                                    if (allCause.includes(d.name)) {
                                        const causeName = d.name;
                                        barChartType = 'cause'
                                        selectedCause.has(causeName) ?
                                            selectedCause.delete(causeName) :
                                            selectedCause.add(causeName)

                                        if (!$('#cause').hasClass('barsblue')) {
                                            $('#cause').toggleClass('barsblue')
                                        }
                                        $('#actor').removeClass("barsblue")
                                        $('#province-button').removeClass("barsblue")

                                        updateBarchart();
                                        updateSankey();
                                    }
                                })
                                .on('mouseenter', function (actual, i) {
                                    highlighted = {
                                        type: Object.keys(actual)[0],
                                        value: actual[Object.keys(actual)[0]]
                                    }

                                    updateBarchart()
                                    // rerenderNode()
                                })
                                .on("mousemove", function (d) {

                                    const type = Object.keys(d)[0];

                                    d3.selectAll('.deaths')
                                        .text(d.value)

                                    d3.selectAll('.date')
                                        .text(currentDate.slice(0,4) || "");

                                    d3.selectAll('.datetype')
                                        .text("in");

                                    var w = window.innerWidth;

                                    if (w / 3 * 2 < d3.event.pageX) {
                                        d3.select("#tooltip")
                                            .style("top", (d3.event.pageY) + 20 + "px")
                                            .style("left", (d3.event.pageX) - 240 + "px")
                                    } else {
                                        d3.select("#tooltip")
                                            .style("top", (d3.event.pageY) + 20 + "px")
                                            .style("left", (d3.event.pageX) + 20 + "px")
                                    }

                                    if (type === "province") {

                                        d3.select('#province')
                                            .text(d[Object.keys(d)[0]]);

                                        d3.select("#syriaTooltip").classed("hidden", false);
                                    } else {
                                        d3.select('#actorData')
                                            .text(d[Object.keys(d)[0]]);

                                        d3.select("#barChartTooltip").classed("hidden", false);
                                    }

                                    d3.select("#tooltip").classed("hidden", false);
                                })
                                .on("mouseout", function (d) {
                                    d3.select("#tooltip").classed("hidden", true);
                                    d3.select("#syriaTooltip").classed("hidden", true);
                                    d3.select("#barChartTooltip").classed("hidden", true);
                                })


                            rerenderNode = function () {
                                node.select("rect")
                                    // .attr("x", function(d) { return d.x0; })
                                    .attr("y", function (d) {
                                        return d.y0;
                                    })
                                    .attr("fill", d => {
                                        if (selectedDistricts.has(d.name))
                                            return "#A50F15"

                                        if (selectedActors.has(d.name))
                                            return "green"

                                        if (selectedCause.has(d.name))
                                            return "blue"

                                        return "black"
                                    })
                                    .attr("opacity", (d) => {

                                        if (highlighted.value === d.name) {
                                            return "0.4"
                                        }

                                        // return "1.0"
                                        return d.value * 0.00009 + 0.3
                                    })
                                    .attr("height", function (d) {
                                        return d.y1 - d.y0;
                                    });
                                // .attr("width", function(d) { return d.x1 - d.x0; });

                            }

                            rerenderNode()

                            nodeEnter.append("text")
                                .attr("dy", "0.35em")
                                .attr("text-anchor", "end")
                                .attr("x", function (d) {
                                    return d.x0 - 6;
                                })
                                .attr("y", function (d) {
                                    return (d.y1 + d.y0) / 2;
                                })
                                .text(function (d) {
                                    return d.name;
                                })
                                .filter(function (d) {
                                    return d.x0 < width / 2;
                                })
                                .attr("x", function (d) {
                                    return d.x1 + 6;
                                })
                                .attr("text-anchor", "start");

                            node.select("text").transition(t)
                                // .attr("dy", "0.35em")
                                // .attr("text-anchor", "end")
                                // .attr("x", function(d) { return d.x0 - 6; })
                                .attr("y", function (d) {
                                    return (d.y1 + d.y0) / 2;
                                })
                                .filter(function (d) {
                                    return d.x0 < width / 2;
                                })
                                // .attr("x", function(d) { return d.x1 + 6; })
                                .attr("text-anchor", "start");

                            nodeEnter.append("title")
                                .text(function (d) {
                                    return d.name + "\n" + format(d.value);
                                });

                            node.select("title")
                                .text(function (d) {
                                    return d.name + "\n" + format(d.value);
                                });

                            node.exit().remove();
                        }


                        updateSankey()

                    });
                });
            });
        });
    });
}