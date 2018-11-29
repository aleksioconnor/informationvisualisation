//----------------------------
// Linechart idiom
//----------------------------

var lineChart = null

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
        top: 60,
        right: 20,
        bottom: 60,
        left: 75
    },
    
    width = (windowWidth / 2) - margin.left - margin.right,
    height = (windowHeight / 2) - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var valueLines = {
        "Sugar (kg, SYP)": d3.line().x(function (d) {
                return x(parseTime(d.date));
            })
            .y(function (d) {
                return y(d["Sugar (kg, SYP)"])
            }),
    }

    lineChart = d3
        .select("#linechart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("style", "margin: 0 auto; display: block;  border: 3px solid black;")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    focus = lineChart.append("g") // define focus boy
        .style("display", "none");

     //----------------------------
    // Decide what clicking the buttons does
    //----------------------------

    var dataToShow = "USDtoSYP"

    d3.selectAll("#USDtoSYP")
        .on("click", function() {
        dataToShow = "USDtoSYP"
        console.log("USD to SYP tab clicked")
        drawLineChart()
    });

    d3.selectAll("#sugar")
        .on("click", function() {
        dataToShow = "sugar"
        console.log("sugar tab clicked")
        drawLineChart()
    });

    d3.selectAll("#rice")
        .on("click", function() {
        dataToShow = "rice"
        console.log("rice tab clicked")
        drawLineChart()
    });

    //----------------------------
    // Draw linechart
    //----------------------------

    drawLineChart = function () {

        // Load the data
        d3.json("data/foodPrices2.json").then(function (data) {

            const foodPricesBig = Object.values(data)
            const currentDateIndex = foodPricesBig.findIndex(item => item.date === currentDate)
            const foodPrices = foodPricesBig.slice(0, currentDateIndex)

            x.domain(d3.extent(Object.keys(data), function (d) {
                return parseTime(d);
            }));
            y.domain([0, 500])

            var previouslySelected = "Sugar (kg, SYP)";

            if (currentDate !== "2013-01") {
                lineChart
                    .selectAll("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    .attr("d", valueLines["Sugar (kg, SYP)"]);

            } else {
                lineChart
                    .append("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    // .attr("id", "sugar")
                    .attr("d", valueLines["Sugar (kg, SYP)"]);

                lineChart.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                var yAxis = lineChart.append("g")
                    .attr("id", "yaxis")
                    .call(d3.axisLeft(y));
            }

            // var dropdown = d3.select("#line-chart-dropdown")
            //     .attr("class", "test")
            //     .on("change", function (d) {
            //         var selected = d3.select("#line-chart-dropdown").node().value;
            //         d3.select("path#" + previouslySelected).remove();

            //         previouslySelected = selected;
            //         y.domain([0, d3.max(data.foodPrices, function (d) {
            //             return Math.max(d[mapping[selected]]);
            //         })])
            //         d3.select("#yaxis")
            //             .call(d3.axisLeft(y));

            //         lineChart.append("path")
            //             .data([data.foodPrices])
            //             .attr("class", "line")
            //             .attr("id", selected)
            //             .attr("d", valueLines[selected]);
            //     });

        });
    }

    drawLineChart()
}