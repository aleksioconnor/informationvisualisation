// Initialize line chart
function lineChartInit() {
    // hacky fix
    var mapping = {
        "sugar": "Sugar (kg, SYP)",
        "bread": "Bread (SYP)",
        "fuel": "Fuel (diesel, liter, SYP)",
        "rice": "Rice (kg, SYP)",
        "tea": "Tea (kg, SYP)"
    }
    // set the dimensions and margins of the graph
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 30
        },
        width = (windowWidth/2) - margin.left - margin.right,
        height = (windowHeight/2)- margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var valuelines = {
        "sugar": d3.line().x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d["Sugar (kg, SYP)"])
            }),
        "bread": d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d["Bread (SYP)"]);
            }),
        "fuel": d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d["Fuel (diesel, liter, SYP)"]);
            }),
        "rice": d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d["Rice (kg, SYP)"]);
            }),
        "tea": d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d["Tea (kg, SYP)"]);
            })
    }

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var svg = d3.select("#linechart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    focus = svg.append("g") // define focus boy
        .style("display", "none");

    // Load the data
    d3.json("data/foodPrices.json").then(function (data) {
        data.foodPrices.forEach(function (d) {
            d.date = parseTime(d.date);
            d["Sugar (kg, SYP)"] = +d["Sugar (kg, SYP)"];
            d["Bread (SYP)"] = +d["Bread (SYP)"];
            d["Fuel (diesel, liter, SYP)"] = +d["Fuel (diesel, liter, SYP)"];
            d["Rice (kg, SYP)"] = +d["Rice (kg, SYP)"];
            d["Tea (kg, SYP)"] = +d["Tea (kg, SYP)"];
        });
        x.domain(d3.extent(data.foodPrices, function (d) {
            return d.date;
        }));
        y.domain([0, d3.max(data.foodPrices, function (d) {
            return Math.max(d["Sugar (kg, SYP)"]);
        })])

        var previouslySelected = "sugar";

        svg.append("path")
            .data([data.foodPrices])
            .attr("class", "line")
            .attr("id", "sugar")
            .attr("d", valuelines.sugar);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var yAxis = svg.append("g")
            .attr("id", "yaxis")
            .call(d3.axisLeft(y));

        var dropdown = d3.select("#line-chart-dropdown")
            .attr("class", "test")
            .on("change", function (d) {
                var selected = d3.select("#line-chart-dropdown").node().value;
                d3.select("path#" + previouslySelected).remove();

                previouslySelected = selected;
                y.domain([0, d3.max(data.foodPrices, function (d) {
                    return Math.max(d[mapping[selected]]);
                })])
                d3.select("#yaxis")
                    .call(d3.axisLeft(y));

                svg.append("path")
                    .data([data.foodPrices])
                    .attr("class", "line")
                    .attr("id", selected)
                    .attr("d", valuelines[selected]);
            });

    });
}
