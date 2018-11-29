function sankeyInit() {

    // load data
    var data = {"nodes":[{"name":"Damascus Suburbs"},{"name":"2017-05-01"},{"name":"Homs"},{"name":"Daraa"},{"name":"Damascus"},{"name":"Deir Ezzor"},{"name":"Aleppo"},{"name":"Raqqa"},{"name":"Hama"},{"name":"2017-05-02"},{"name":"Idlib"},{"name":"2017-05-03"},{"name":"Unknown"},{"name":"2017-05-04"},{"name":"2017-05-05"},{"name":"2017-05-06"},{"name":"2017-05-07"},{"name":"2017-05-08"},{"name":"Quneitra"},{"name":"2017-05-09"},{"name":"2017-05-10"},{"name":"2017-05-11"},{"name":"2017-05-12"},{"name":"2017-05-13"},{"name":"2017-05-14"},{"name":"2017-05-15"},{"name":"2017-05-16"},{"name":"2017-05-17"},{"name":"2017-05-18"},{"name":"2017-05-19"},{"name":"2017-05-20"},{"name":"2017-05-21"},{"name":"2017-05-22"},{"name":"2017-05-23"},{"name":"2017-05-24"},{"name":"2017-05-25"},{"name":"2017-05-26"},{"name":"2017-05-27"},{"name":"2017-05-28"},{"name":"2017-05-29"},{"name":"2017-05-30"},{"name":"2017-05-31"},{"name":"Armed opposition groups"},{"name":"Not identified"},{"name":"International coalition forces"},{"name":"Syrian government and affiliated militias"},{"name":"The organization of the Islamic State in Iraq and the Levant - ISIS"},{"name":"Self administration forces"},{"name":"Russian troops"},{"name":"Shooting"},{"name":"Warplane shelling"},{"name":"Kidnapping - Torture"},{"name":"Field Execution"},{"name":"Other"},{"name":"Kidnapping - Execution"},{"name":"Shelling"},{"name":"Explosion"},{"name":"Detention - Torture"},{"name":"Detention - Execution"},{"name":"Kidnapping - Torture - Execution"},{"name":"Siege"}],"links":[{"source":1,"target":0,"value":19},{"source":1,"target":2,"value":5},{"source":1,"target":3,"value":1},{"source":1,"target":4,"value":2},{"source":1,"target":5,"value":6},{"source":1,"target":6,"value":17},{"source":1,"target":7,"value":2},{"source":1,"target":8,"value":1},{"source":9,"target":0,"value":8},{"source":9,"target":4,"value":5},{"source":9,"target":3,"value":7},{"source":9,"target":8,"value":7},{"source":9,"target":10,"value":8},{"source":9,"target":2,"value":2},{"source":9,"target":5,"value":4},{"source":11,"target":0,"value":21},{"source":11,"target":3,"value":3},{"source":11,"target":5,"value":2},{"source":11,"target":7,"value":1},{"source":11,"target":2,"value":1},{"source":11,"target":10,"value":1},{"source":11,"target":8,"value":3},{"source":11,"target":12,"value":2},{"source":13,"target":0,"value":20},{"source":13,"target":2,"value":2},{"source":13,"target":4,"value":4},{"source":13,"target":3,"value":6},{"source":13,"target":5,"value":3},{"source":13,"target":8,"value":3},{"source":13,"target":10,"value":1},{"source":14,"target":0,"value":11},{"source":14,"target":2,"value":2},{"source":14,"target":4,"value":5},{"source":14,"target":6,"value":3},{"source":14,"target":10,"value":18},{"source":14,"target":5,"value":1},{"source":14,"target":3,"value":4},{"source":14,"target":8,"value":4},{"source":15,"target":2,"value":4},{"source":15,"target":10,"value":5},{"source":15,"target":8,"value":3},{"source":15,"target":3,"value":4},{"source":15,"target":0,"value":10},{"source":15,"target":5,"value":1},{"source":16,"target":6,"value":5},{"source":16,"target":8,"value":18},{"source":16,"target":10,"value":5},{"source":16,"target":2,"value":2},{"source":16,"target":5,"value":3},{"source":16,"target":0,"value":3},{"source":16,"target":4,"value":4},{"source":17,"target":0,"value":9},{"source":17,"target":6,"value":6},{"source":17,"target":5,"value":1},{"source":17,"target":10,"value":4},{"source":17,"target":8,"value":4},{"source":17,"target":3,"value":7},{"source":17,"target":18,"value":1},{"source":19,"target":2,"value":10},{"source":19,"target":6,"value":26},{"source":19,"target":7,"value":1},{"source":19,"target":10,"value":4},{"source":19,"target":3,"value":1},{"source":19,"target":0,"value":2},{"source":19,"target":5,"value":5},{"source":20,"target":0,"value":2},{"source":20,"target":5,"value":19},{"source":20,"target":7,"value":11},{"source":20,"target":10,"value":3},{"source":20,"target":8,"value":2},{"source":20,"target":3,"value":3},{"source":20,"target":6,"value":1},{"source":21,"target":2,"value":1},{"source":21,"target":4,"value":1},{"source":21,"target":0,"value":2},{"source":21,"target":3,"value":3},{"source":21,"target":5,"value":10},{"source":22,"target":10,"value":4},{"source":22,"target":0,"value":5},{"source":22,"target":6,"value":4},{"source":22,"target":2,"value":1},{"source":22,"target":5,"value":9},{"source":23,"target":0,"value":1},{"source":23,"target":2,"value":4},{"source":24,"target":2,"value":4},{"source":24,"target":0,"value":3},{"source":24,"target":8,"value":2},{"source":24,"target":3,"value":2},{"source":24,"target":6,"value":3},{"source":24,"target":5,"value":13},{"source":25,"target":2,"value":4},{"source":25,"target":0,"value":18},{"source":25,"target":7,"value":1},{"source":25,"target":8,"value":2},{"source":25,"target":5,"value":3},{"source":25,"target":6,"value":1},{"source":26,"target":6,"value":8},{"source":26,"target":5,"value":25},{"source":26,"target":0,"value":5},{"source":26,"target":2,"value":4},{"source":26,"target":10,"value":4},{"source":27,"target":5,"value":1},{"source":27,"target":8,"value":2},{"source":27,"target":0,"value":3},{"source":27,"target":10,"value":1},{"source":27,"target":3,"value":8},{"source":28,"target":8,"value":1},{"source":28,"target":2,"value":2},{"source":28,"target":0,"value":1},{"source":28,"target":3,"value":7},{"source":28,"target":6,"value":6},{"source":29,"target":3,"value":2},{"source":29,"target":2,"value":3},{"source":29,"target":0,"value":2},{"source":29,"target":10,"value":1},{"source":29,"target":4,"value":2},{"source":29,"target":6,"value":2},{"source":30,"target":3,"value":1},{"source":30,"target":0,"value":5},{"source":30,"target":10,"value":1},{"source":30,"target":5,"value":3},{"source":30,"target":4,"value":1},{"source":31,"target":5,"value":23},{"source":31,"target":10,"value":2},{"source":31,"target":3,"value":5},{"source":31,"target":4,"value":1},{"source":31,"target":0,"value":2},{"source":31,"target":8,"value":15},{"source":31,"target":6,"value":1},{"source":32,"target":3,"value":6},{"source":32,"target":7,"value":9},{"source":32,"target":5,"value":10},{"source":32,"target":6,"value":3},{"source":32,"target":2,"value":6},{"source":32,"target":0,"value":3},{"source":32,"target":10,"value":3},{"source":33,"target":3,"value":3},{"source":33,"target":5,"value":5},{"source":33,"target":6,"value":28},{"source":33,"target":8,"value":3},{"source":33,"target":2,"value":15},{"source":33,"target":10,"value":1},{"source":33,"target":0,"value":1},{"source":33,"target":7,"value":1},{"source":34,"target":0,"value":1},{"source":34,"target":2,"value":2},{"source":34,"target":5,"value":15},{"source":34,"target":6,"value":2},{"source":34,"target":8,"value":1},{"source":35,"target":0,"value":2},{"source":35,"target":8,"value":4},{"source":35,"target":5,"value":9},{"source":35,"target":3,"value":3},{"source":35,"target":6,"value":2},{"source":36,"target":0,"value":3},{"source":36,"target":4,"value":2},{"source":36,"target":2,"value":3},{"source":36,"target":8,"value":4},{"source":36,"target":10,"value":2},{"source":36,"target":3,"value":2},{"source":36,"target":7,"value":1},{"source":36,"target":5,"value":2},{"source":37,"target":2,"value":6},{"source":37,"target":8,"value":1},{"source":37,"target":3,"value":3},{"source":37,"target":0,"value":1},{"source":37,"target":6,"value":2},{"source":38,"target":2,"value":5},{"source":38,"target":4,"value":2},{"source":38,"target":3,"value":4},{"source":38,"target":5,"value":6},{"source":39,"target":3,"value":7},{"source":39,"target":10,"value":2},{"source":39,"target":5,"value":13},{"source":39,"target":0,"value":1},{"source":40,"target":0,"value":6},{"source":40,"target":5,"value":8},{"source":40,"target":4,"value":1},{"source":41,"target":0,"value":6},{"source":41,"target":6,"value":5},{"source":41,"target":4,"value":1},{"source":41,"target":5,"value":2},{"source":0,"target":42,"value":104},{"source":0,"target":43,"value":28},{"source":2,"target":44,"value":39},{"source":2,"target":45,"value":23},{"source":2,"target":43,"value":3},{"source":0,"target":45,"value":40},{"source":3,"target":42,"value":8},{"source":4,"target":43,"value":3},{"source":4,"target":45,"value":24},{"source":5,"target":46,"value":78},{"source":6,"target":45,"value":40},{"source":7,"target":47,"value":2},{"source":8,"target":45,"value":54},{"source":4,"target":42,"value":1},{"source":3,"target":45,"value":50},{"source":10,"target":45,"value":36},{"source":10,"target":44,"value":21},{"source":2,"target":42,"value":1},{"source":5,"target":45,"value":47},{"source":5,"target":47,"value":9},{"source":7,"target":46,"value":10},{"source":12,"target":42,"value":2},{"source":2,"target":46,"value":11},{"source":3,"target":46,"value":14},{"source":8,"target":42,"value":1},{"source":3,"target":43,"value":20},{"source":6,"target":47,"value":9},{"source":6,"target":46,"value":20},{"source":10,"target":43,"value":5},{"source":5,"target":44,"value":52},{"source":6,"target":48,"value":24},{"source":10,"target":47,"value":5},{"source":6,"target":44,"value":26},{"source":8,"target":44,"value":2},{"source":8,"target":48,"value":6},{"source":18,"target":46,"value":1},{"source":2,"target":48,"value":11},{"source":7,"target":48,"value":1},{"source":5,"target":48,"value":12},{"source":7,"target":44,"value":14},{"source":0,"target":46,"value":4},{"source":5,"target":42,"value":1},{"source":10,"target":42,"value":1},{"source":6,"target":43,"value":4},{"source":4,"target":46,"value":3},{"source":10,"target":46,"value":2},{"source":8,"target":46,"value":14},{"source":8,"target":43,"value":3},{"source":5,"target":43,"value":3},{"source":6,"target":42,"value":2},{"source":42,"target":49,"value":113},{"source":43,"target":49,"value":13},{"source":44,"target":50,"value":154},{"source":45,"target":49,"value":133},{"source":43,"target":12,"value":23},{"source":43,"target":51,"value":1},{"source":45,"target":50,"value":81},{"source":42,"target":52,"value":5},{"source":43,"target":53,"value":7},{"source":46,"target":50,"value":1},{"source":46,"target":54,"value":10},{"source":45,"target":55,"value":60},{"source":47,"target":49,"value":17},{"source":45,"target":56,"value":23},{"source":46,"target":56,"value":56},{"source":46,"target":49,"value":19},{"source":46,"target":55,"value":46},{"source":47,"target":51,"value":1},{"source":43,"target":56,"value":14},{"source":48,"target":50,"value":52},{"source":45,"target":57,"value":14},{"source":48,"target":56,"value":2},{"source":42,"target":58,"value":1},{"source":46,"target":59,"value":3},{"source":43,"target":50,"value":4},{"source":46,"target":52,"value":21},{"source":45,"target":53,"value":1},{"source":43,"target":55,"value":7},{"source":42,"target":55,"value":1},{"source":45,"target":60,"value":1},{"source":42,"target":56,"value":1},{"source":47,"target":55,"value":7},{"source":46,"target":58,"value":1},{"source":45,"target":52,"value":1}]}

    var width = 1000
    var height = 600

    function format(d) {
        const f = d3.format(",.0f");
        return `${f(d)}`;
    }
    var svg = d3.select("#sankey").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "margin: 0 auto; display: block;  border: 3px solid black;");

    var sankey = d3.sankey().size([width, height]); // Constructs a new Sankey generator with the default settings.
    var {
        nodes,
        links
    } = sankey(data); // Computes the node and link positions for the given arguments, returning a graph representing the Sankey layout
    // in this case nodes is an array of nodes and links an array of links
    // select all inactive nodes and hide them from dom

    // draw the nodes
    var node = svg.append("g")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .selectAll("rect")
        .data(nodes)
        .enter().append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => Math.max(1, d.y1 - d.y0))
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", "green")
        .append("title")
        .text(d => `${d.name}\n${format(d.value)}`);

    

    // links
    var link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.5)
        .selectAll("g")
        .data(links)
        .enter().append("g")
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
        .style("font", "10px sans-serif")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", function (d) {
            return (d.y1 + d.y0) / 2
        })
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < 10 * 4 / 5 ? "start" : "end")
        .text(d => d.name)
        .style('fill', 'black');

}