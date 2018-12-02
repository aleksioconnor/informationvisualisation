function sankeyInit() {

    // load data
    // d3.queue()
    // .defer(d3.json, "../data-parsing/sankey/sankey2016.json")
    // .defer(d3.json, "../data-parsing/sankey/sankey2014.json")
    // .awaitAll(ready);

    d3.json("../data-parsing/sankey/sankey2016.json").then(function (data) {
        console.log(data);
        var width = 650
        var height = 500

        function format(d) {
            const f = d3.format(",.0f");
            return `${f(d)}`;
        }
        var svg = d3.select("#sankey").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("style", "margin: 0 auto; display: block;  border: 3px solid black;")
        // .attr("style", "background-color: black")

        var sankey = d3.sankey().size([width, height]).iterations(0); // Constructs a new Sankey generator with the default settings.
        var {
            nodes,
            links
        } = sankey(data); // Computes the node and link positions for the given arguments, returning a graph representing the Sankey layout
        // in this case nodes is an array of nodes and links an array of links
        // select all inactive nodes and hide them from dom

        // draw the nodes
        var node = svg.append("g")
            // .attr("stroke", "#000")
            // .attr("stroke-width", 1)
            .selectAll("rect")
            .data(nodes)
            .enter().append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => Math.max(1, d.y1 - d.y0))
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", "black")
            .attr("opacity", 0.8)
            .append("title")
            .on("mouseover", d => {
                console.log(d);
            })
            .text(d => `${d.name}\n${format(d.value)}`);



        // links
        var link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.2)
            .selectAll("g")
            .data(links)
            .enter().append("g")
            .attr('class', 'link')
            .style("mix-blend-mode", "multiply")


        link.append("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke-width", function (d) {
                return Math.max(1, d.width)
            })
            .append("title")
            .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);


        // labels
        var text = svg.append("g")
            .style("font", "14px sans-serif")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("x", d => {
                return d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6; // if on left side, first clause

            })
            .attr("y", function (d) {
                return (d.y1 + d.y0) / 2
            })
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < 10 * 4 / 5 ? "start" : "end")
            .text(d => d.name)
            .style('fill', 'black')
            // .style('text-shadow', '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
            .style('opacity', 1)
    });
}