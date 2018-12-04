// function sankeyInit() {

//     d3.json("../data/sankey2013.json").then(function (data) {
//         var width = 600
//         var height = 370

//         function format(d) {
//             const f = d3.format(",.0f");
//             return `${f(d)}`;
//         }
//         var svg = d3.select("#sankey").append("svg")
//             .attr("width", width)
//             .attr("height", height)
//             .attr("style", "margin: 0 auto; display: block;")

//         var sankey = d3.sankey().size([width, height]).iterations(0); // Constructs a new Sankey generator with the default settings.
//         var {
//             nodes,
//             links
//         } = sankey(data); // Computes the node and link positions for the given arguments, returning a graph representing the Sankey layout
//         // in this case nodes is an array of nodes and links an array of links
//         // select all inactive nodes and hide them from dom

//         // draw the nodes
//         var node = svg.append("g")
//             // .attr("stroke", "#000")
//             // .attr("stroke-width", 1)
//             .selectAll("rect")
//             .data(nodes)
//             .enter().append("rect")
//             .attr("x", d => d.x0)
//             .attr("y", d => d.y0)
//             .attr("height", d => Math.max(1, d.y1 - d.y0))
//             .attr("width", d => d.x1 - d.x0)
//             .attr("fill", d => {
//                 return "gray"
//             })
//             .attr("opacity", 0.9)
//             .append("title")
//             .on("mouseover", d => {
//                 console.log(d);
//             })
//             .text(d => `${d.name}\n${format(d.value)}`);



//         // links
//         var link = svg.append("g")
//             .attr("fill", "none")
//             .attr("stroke", "#000")
//             .attr("stroke-opacity", 0.2)
//             .selectAll("g")
//             .data(links)
//             .enter().append("g")
//             .attr('class', 'link')
//             .style("mix-blend-mode", "multiply")


//         link.append("path")
//             .attr("d", d3.sankeyLinkHorizontal())
//             .attr("stroke-width", function (d) {
//                 return Math.max(1, d.width)
//             })
//             .append("title")
//             .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);


//         // labels
//         var text = svg.append("g")
//             .style("font", "14px sans-serif")
//             .selectAll("text")
//             .data(nodes)
//             .enter().append("text")
//             .attr("x", d => {
//                 return d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6; // if on left side, first clause

//             })
//             .attr("y", function (d) {
//                 return (d.y1 + d.y0) / 2
//             })
//             .attr("dy", "0.35em")
//             .attr("text-anchor", d => d.x0 < 10 * 4 / 5 ? "start" : "end")
//             .text(d => d.name)
//             .style('fill', 'black')
//             // .style('text-shadow', '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
//             .style('opacity', 1)
//     });
// }

function sankeyInit() {

    function format(d) {
        const f = d3.format(",.0f");
        return `${f(d)}`;
    }

    var t = d3.transition()
        .duration(100)
        .ease(d3.easeLinear);

    var width = 600
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
                            var date = newDate.substring(0,4); // year
                            $('#sankey-year').html(date)
                            console.log(date);
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
                                    return d.source.name + " → " + d.target.name + "\n" + format(d.value / 1e3);
                                });

                            link.exit().remove();


                            var node = nodes.selectAll("g")
                                .data(graph.nodes, function (d) {
                                    return d.name;
                                });

                            var nodeEnter = node.enter().append("g");

                            nodeEnter.append("rect")
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
                                .attr("fill", "gray");


                            node.select("rect").transition(t)
                                // .attr("x", function(d) { return d.x0; })
                                .attr("y", function (d) {
                                    return d.y0;
                                })
                                .attr("height", function (d) {
                                    return d.y1 - d.y0;
                                });
                            // .attr("width", function(d) { return d.x1 - d.x0; });

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
                                    return d.name + "\n" + format(d.value / 1e3);
                                });

                            node.select("title")
                                .text(function (d) {
                                    return d.name + "\n" + format(d.value / 1e3);
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