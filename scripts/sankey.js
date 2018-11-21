function sankeyInit() {
    var data = data = ({
        "nodes": [{
            "name": "Socialdemokraterna (28.3%)"
        }, {
            "name": "Vänsterpartiet (8.0%)"
        }, {
            "name": "Miljöpartiet (4.4%)"
        }, {
            "name": "Moderaterna (19.8%)"
        }, {
            "name": "Centerpartiet (8.6%)"
        }, {
            "name": "Kristdemokraterna (6.3%)"
        }, {
            "name": "Liberalerna (5.5%)"
        }, {
            "name": "Sverigedemokraterna (17.5%)"
        }, {
            "name": "Röd-Grönna (40.7%)"
        }, {
            "name": "Alliansen (40.2%)"
        }, {
            "name": "Stand alone (17.5%)"
        }],
        "links": [{
            "source": 0,
            "target": 8,
            "value": 2000.3
        }, {
            "source": 1,
            "target": 8,
            "value": 800.0
        }, {
            "source": 2,
            "target": 8,
            "value": 400.4
        }, {
            "source": 3,
            "target": 9,
            "value": 1900.8
        }, {
            "source": 4,
            "target": 9,
            "value": 800.6
        }, {
            "source": 5,
            "target": 9,
            "value": 600.3
        }, {
            "source": 6,
            "target": 9,
            "value": 5.5
        }, {
            "source": 7,
            "target": 10,
            "value": 170000.5
        }]
    })
    // mock data

    var svg = d3.select("#sankey").append("svg")
    .attr("width", "100%")
    .attr("height", 599);

    var sankey = d3.sankey(); // Constructs a new Sankey generator with the default settings.
    var {
        nodes,
        links
    } = sankey(data); // Computes the node and link positions for the given arguments, returning a graph representing the Sankey layout
    // in this case nodes is an array of nodes and links an array of links
    console.log(nodes)

    // draw the nodes
    var nodes = svg.append("g")
        .attr("stroke", "white")
        .selectAll("rect")
        .data(nodes)
        .enter().append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => Math.max(1, d.y1 - d.y0))
        .attr("width", d => d.x1 - d.x0)
        .attr("stroke-width", 0);

    // links
    var links = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(links)
        .enter().append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function (d) {
            return Math.max(1, d.width)
        })


}